import os
import urllib3
import hashlib
from collections import namedtuple

import ujson
from lockfile.mkdirlockfile import MkdirLockFile


CachedObject = namedtuple('CachedObject', 'headers, data')


CASED_HEADERS = {
    'etag': 'ETag',
    'last-modified': 'Last-Modified'
}


class FileCache(object):
    def __init__(self, base_directory, filemode=0o0600,
                 dirmode=0o0700):
        self.base_directory = base_directory
        self.dirmode = dirmode

    def get(self, key):
        dirname = self.get_dirpath(key)

        if not dirname:
            return None

        return CachedObject(
            headers=ujson.loads(self.read(os.path.join(dirname, 'headers'))),
            data=self.read(os.path.join(dirname, 'data')))

    def get_dirpath(self, key):
        dirname = self.gen_directory_name(key)

        if not os.path.exists(dirname):
            return None

        return dirname

    def normalize_headers(self, headers):
        def _normalize(name, value):
            return (CASED_HEADERS.get(name.lower(), name),
                    value)

        new_headers = dict(_normalize(k, v) for k, v in headers.items())

        return new_headers

    def set(self, key, response):
        dirname = self.gen_directory_name(key)

        try:
            os.makedirs(dirname, self.dirmode)
        except (IOError, OSError):
            pass

        with MkdirLockFile(dirname) as lock:
            self.write(os.path.join(lock.path, 'headers'),
                       ujson.dumps(
                           self.normalize_headers(response.headers)))
            self.write(os.path.join(lock.path, 'data'),
                       response.data)

    def read(self, filename):
        with open(filename, 'rb') as fh:
            return fh.read()

    def write(self, filename, data):
        try:
            os.remove(filename)
        except (IOError, OSError):
            pass

        with open(filename, 'w') as f:
            f.write(data)

    @staticmethod
    def hashed(x):
        return hashlib.sha224(x.encode()).hexdigest()

    def gen_directory_name(self, url):
        hashed = self.hashed(url)
        parts = list(hashed[:5]) + [hashed]
        return os.path.join(self.base_directory, *parts)


class HTTPClient(object):

    def __init__(self, cache):
        self.cache = cache
        self.http = urllib3.PoolManager()

    def _write_file(self, filename, data):
        with open(filename, 'wb') as f:
            f.write(data)
        return filename

    def retrieve(self, url, filename, force_cache=False):
        cached = self.cache.get(url)

        headers = {}
        if cached:
            if force_cache:
                return self._write_file(filename, cached.data)

            headers['If-None-Match'] = cached.headers['ETag']
            headers['If-Modified-Since'] = cached.headers['Last-Modified']

        response = self.http.request('GET', url, headers=headers)

        if response.status == 200:
            self.cache.set(url, response)

        elif response.status == 304:
            response.read(decode_content=False)
            response.release_conn()

            response = cached
        else:
            raise Exception('No file content received. Status Code %s' %
                            response.status)

        return self._write_file(filename, response.data)
