#include "include/router.hpp"
#include <boost/beast/http/message_fwd.hpp>
#include <boost/beast/http/string_body_fwd.hpp>
#include <boost/beast/http/verb.hpp>
#include <vector>

namespace {
namespace http = boost::beast::http;
namespace ip = boost::asio::ip;
} // namespace

Router::Router() {
  add(Route{http::verb::get, "/",
            [](http::request<http::string_body> &req, ip::tcp::socket &socket) {
              std::string response = "HTTP/1.1 200 OK\r\n"
                                     "Content-Type: text/plain\r\n\r\n"
                                     "HELLO THIS IS THE INDEX ROUTE";

              boost::asio::write(socket, boost::asio::buffer(response));
              socket.close();
            }});
}

void Router::add(const Route &r) { routes.push_back(r); }

const std::vector<Route> &Router::getRoutes() const { return routes; }
