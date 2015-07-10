import os
import re
import time
import codecs
import itertools
import json

import requests
import requests_cache


BASE_URL = "http://neurovault.org/api"
COLLECTIONS_URL = BASE_URL + "/collections"
COLLECTIONS_IMAGES_URL = os.path.join(COLLECTIONS_URL, '%s', 'images')
IMAGES_URL = BASE_URL + "/images"

TC_RE = re.compile(r'temporary collection')


def fetch_json(url):
    r = requests.get(url)
    return r.json()


def fetch_collection_batches(url):
    while True:
        data = fetch_json(url)
        next_url = data.get('next')
        yield data
        if next_url:
            url = next_url
        else:
            break


def fetch_collection_images(collection_id):
    data = fetch_json(COLLECTIONS_IMAGES_URL % collection_id)
    return data['results']


def join_batches(batch_iterator):
    for batch in batch_iterator:
        for c in batch['results']:
            yield c


def filter_temporary_collections(iterator):
    def predicate(x):
        return not TC_RE.search(x['name'])
    return itertools.ifilter(predicate, iterator)


def add_images(collection):
    collection['images'] = fetch_collection_images(collection['id'])
    collection['number_of_images'] = len(collection['images'])
    return collection


def append_collection_images(iterator):
    for collection in iterator:
        yield add_images(collection)


def main():
    pipeline = (fetch_collection_batches,
                join_batches,
                filter_temporary_collections,
                append_collection_images,
                list)

    collections = reduce(lambda x, y: y(x), pipeline, COLLECTIONS_URL)

    print len(collections)

    c504 = [x for x in collections if x['id'] == 504][0]
    print json.dumps(c504, indent=4, separators=(',', ': '))


if __name__ == '__main__':
    requests_cache.install_cache('nv_cache')
    main()
