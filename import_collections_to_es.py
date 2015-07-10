import os
import re
import time
import codecs
import itertools
import json

import requests
import requests_cache

from elasticsearch import Elasticsearch
from elasticsearch.helpers import streaming_bulk


BASE_URL = "http://neurovault.org/api"
COLLECTIONS_URL = BASE_URL + "/collections"
COLLECTIONS_IMAGES_URL = os.path.join(COLLECTIONS_URL, '%s', 'images')
IMAGES_URL = BASE_URL + "/images"

ES_COLLECTION_MAPPING = {
    "collection": {
        "properties": {
            "images": {
                "type": "nested",
                "properties": {
                        "cognitive_paradigm_cogatlas": {"type": "string"},
                        "cognitive_paradigm_cogatlas_id": {"type": "string"},
                        "file": {"type": "string"},
                        "modality": {"type": "string"},
                        "contrast_definition_cogatlas": {"type": "string"},
                        "contrast_definition": {"type": "string"},
                        "figure": {"type": "string"},
                        "add_date": {"type": "date"},
                        "smoothness_fwhm": {"type": "float"},
                        "brain_coverage": {"type": "float"},
                        "reduced_representation": {"type": "string"},
                        "perc_bad_voxels": {"type": "float"},
                        "description": {"type": "string"},
                        "statistic_parameters": {"type": "float"},
                        "map_type": {"type": "string"},
                        "not_mni": {"type": "boolean"},
                        "name": {"type": "string"},
                        "url": {"type": "string"},
                        "thumbnail": {"type": "string"},
                        "modify_date": {"type": "date"},
                        "perc_voxels_outside": {"type": "float"},
                        "is_thresholded": {"type": "boolean"}
                }
            }
        }
    }
}


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


def add_collection_images(iterator):
    for collection in iterator:
        yield add_images(collection)


def add_es_doc_type_id(iterator):
    for collection in iterator:
        collection['_id'] =  int(collection['id'])
        yield collection


def add_to_es_index(iterator):
    return iterator


def output_collection(collections, collection_id):
    c504 = [x for x in collections if x['id'] == 504][0]
    print json.dumps(c504, indent=4, separators=(',', ': '))


def get_collections(url=COLLECTIONS_URL):
    pipeline = (fetch_collection_batches,
                join_batches,
                filter_temporary_collections,
                add_collection_images,
                add_es_doc_type_id)

    return reduce(lambda x, y: y(x), pipeline, url)


def create_es_index(client, index):
    client.indices.create(index=index, ignore=400)
    client.indices.put_mapping(
        index=index, doc_type='collection', body=ES_COLLECTION_MAPPING)


def main():
    es = Elasticsearch()
    index = 'neurolearn'

    create_es_index(es, index)

    collections = get_collections()

    for ok, result in streaming_bulk(
        es,
        collections,
        index=index,
        doc_type='collection',
        chunk_size=50  # keep the batch sizes small for appearances only
    ):
        action, result = result.popitem()
        doc_id = result['_id']

        if not ok:
            print 'Failed to %s document %s: %r' % (action, doc_id, result)
        else:
            print doc_id


if __name__ == '__main__':
    requests_cache.install_cache('nv_cache')
    main()
