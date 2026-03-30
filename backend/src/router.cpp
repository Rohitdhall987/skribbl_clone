#include "include/router.hpp"
#include "include/utils/json.hpp"
#include "include/utils/responses.hpp"
#include <boost/asio/ip/tcp.hpp>
#include <boost/beast/http/message_fwd.hpp>
#include <boost/beast/http/string_body_fwd.hpp>
#include <boost/beast/http/verb.hpp>
#include <boost/json.hpp>
#include <boost/json/basic_parser.hpp>
#include <boost/json/object.hpp>
#include <boost/json/parse.hpp>
#include <boost/json/value.hpp>
#include <boost/system/detail/error_code.hpp>
#include <vector>

namespace {
namespace http = boost::beast::http;
namespace ip = boost::asio::ip;
namespace json = boost::json;
} // namespace

Router::Router() {
  add(Route{http::verb::get, "/",
            [](http::request<http::string_body> &req, ip::tcp::socket &socket) {
              Response r;
              r.content = "Hey user";
              r.send(socket);
            }});

  add(Route{http::verb::post, "/create_room",
            [](http::request<http::string_body> &req, ip::tcp::socket &socket) {
              Response r;
              if (json_util::is_valid(req.body())) {
                json::value jv = boost::json::parse(req.body());
                json::object &body = jv.as_object();
                r.status = "201 Created";
                r.content_type = "application/JSON";
                r.content =
                    "{\"message\":\"webSocket will be created soon..\"}";
                r.send(socket);
              } else {
                r.err(socket, "body isnt proper json");
              }
            }});
}

void Router::add(const Route &r) { routes.push_back(r); }

const std::vector<Route> &Router::getRoutes() const { return routes; }
