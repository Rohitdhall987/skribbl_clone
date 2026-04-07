#include "include/connection.hpp"
#include "include/router.hpp"
#include <boost/asio/buffer.hpp>
#include <boost/asio/impl/read.hpp>
#include <boost/asio/io_context.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/asio/write.hpp>
#include <boost/beast/http/impl/read.hpp>
#include <boost/system/detail/error_code.hpp>
#include <cstddef>
#include <iostream>
#include <system_error>

Connection::Connection(boost::asio::io_context &context) : socket(context) {}

void Connection::handle_connection(const std::error_code &ec, Router *router) {

  if (ec) {
    std::cout << "Error while handle_connection : " << ec.message()
              << std::endl;
    return;
  }
  auto self = shared_from_this();

  boost::beast::http::async_read(
      socket, readBuff, request,
      [this, self, router](const boost::system::error_code &ec,
                           std::size_t bytes_transferred) {
        std::string target = std::string(request.target());

        auto pos = target.find('?');
        std::string path =
            (pos == std::string::npos) ? target : target.substr(0, pos);

        bool found = false;
        for (auto r : router->getRoutes()) {
          if (r.type == request.method() && path == r.route_name) {
            r.handler(request, socket);
            found = true;
            break;
          }
        }

        if (!found) {
          std::string response = "HTTP/1.1 404 Not Found\r\n"
                                 "Content-Type: text/plain\r\n\r\n"
                                 "Route not found";

          boost::asio::write(socket, boost::asio::buffer(response));
          socket.close();
        }
      });
}
