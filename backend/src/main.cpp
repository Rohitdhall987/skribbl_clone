#include "include/server.hpp"
#include <boost/asio/io_context.hpp>
#include <cstddef>

#define PORT 8000
#define BACKLOG 100

int main() {

  size_t port = PORT;
  size_t backlog = BACKLOG;

  boost::asio::io_context ctx;
  Server server(ctx, port, backlog);

  server.start();

  return 0;
}
