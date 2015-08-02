import os
import tornado
import tornado.web
from tornado.options import options, define


define('port', default=3001, type=int)


def load_settings():
    import imp

    environment = os.environ.get('ENV', 'development')
    config = imp.load_source('appconfig',
                             './config/%s.cfg' % environment)

    settings = {
        'debug': config.DEBUG,
        'template_path': os.path.join(os.path.dirname(__file__), "templates"),
        'static_path': os.path.join(os.path.dirname(__file__), "static")
    }

    return settings


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r'/', MainHandler)
        ]

        super(Application, self).__init__(handlers, **load_settings())


def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()


if __name__ == '__main__':
    main()
