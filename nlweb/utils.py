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
