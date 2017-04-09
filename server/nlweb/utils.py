import datetime
import numbers


def friendly_time(dt, past_="ago",
                  future_="from now",
                  default="just now"):
    """
    Returns string representing "time since"
    or "time until" e.g.
    3 days ago, 5 hours from now etc.
    """

    now = datetime.datetime.utcnow()
    if now > dt:
        diff = now - dt
        dt_is_past = True
    else:
        diff = dt - now
        dt_is_past = False

    periods = (
        (diff.days / 365, "year", "years"),
        (diff.days / 30, "month", "months"),
        (diff.days / 7, "week", "weeks"),
        (diff.days, "day", "days"),
        (diff.seconds / 3600, "hour", "hours"),
        (diff.seconds / 60, "minute", "minutes"),
        (diff.seconds, "second", "seconds"),
    )

    for period, singular, plural in periods:

        if period:
            return "%d %s %s" % (period,
                                 singular if period == 1 else plural,
                                 past_ if dt_is_past else future_)

    return default


def pick(dictionary, *keys):
    """
    Create a shallow clone of dictionary specified keys only.
    """
    return {k: dictionary[k] for k in keys}


def merge_two_dicts(a, b):
    c = a.copy()
    c.update(b)
    return c


def is_number(value):
    return isinstance(value, numbers.Number)


def request_new_tokens(remote_app, refresh_token):
    rv = remote_app.post(
        remote_app.access_token_url,
        data={
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': remote_app.consumer_key,
            'client_secret': remote_app.consumer_secret
        }
    )

    return rv.data


def request_remote_app(db, session, remote_app, user, url):
    for _ in range(2):
        response = remote_app.get(url)

        try:
            data = response.data['results']
            return data
        except KeyError:
            if response.status == 401:  # Token expired
                neurovault_account = user.neurovault_account
                tokens = request_new_tokens(
                    remote_app,
                    neurovault_account.refresh_token
                )

                session['neurovault_oauth_token'] = (
                    tokens['access_token'], ''
                )

                # Update connection
                neurovault_account.access_token = tokens['access_token']
                neurovault_account.refresh_token = tokens['refresh_token']
                db.session.commit()
            else:
                raise

    raise Exception("Unable to fetch remote app data")
