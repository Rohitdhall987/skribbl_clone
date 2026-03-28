#include "include/router.hpp"
#include "include/server.hpp"
#include <boost/asio/buffer.hpp>
#include <boost/asio/detached.hpp>
#include <boost/asio/io_context.hpp>
#include <boost/asio/write.hpp>
#include <cstddef>

#define PORT 8000
#define BACKLOG 100

int main() {

  size_t port = PORT;
  size_t backlog = BACKLOG;

  boost::asio::io_context ctx;

  Router router;

  router.add(Route{POST, "/data",
                   [](Request &req, boost::asio::ip::tcp::socket &socket) {
                     std::string response = "HTTP/1.1 200 OK\r\n"
                                            "Content-Type: text/plain\r\n\r\n"
                                            "Received: " +
                                            req.body;

                     boost::asio::write(socket, boost::asio::buffer(response));
                   }});

  Server server(ctx, port, backlog, router);

  server.start();

  return 0;
}
