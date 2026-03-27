#include "include/connection.hpp"
#include <boost/asio/buffer.hpp>
#include <boost/asio/impl/read.hpp>
#include <boost/asio/io_context.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/asio/write.hpp>
#include <boost/system/detail/error_code.hpp>
#include <cstddef>
#include <iostream>
#include <system_error>

Connection::Connection(boost::asio::io_context &context) : socket(context) {}

Connection::~Connection() { std::cout << "Objects is distroyed" << std::endl; }

void Connection::handle_connection(const std::error_code &ec) {
  std::cout << "i will handle this connection" << std::endl;

  auto self = shared_from_this();

  asio::async_read_until(
      socket, asio::dynamic_buffer(readBuff), "\r\n\r\n",
      [this, self](const boost::system::error_code &ec,
                   std::size_t bytes_transferred) {
        std::cout << "data : " << readBuff << std::endl;

        if (!ec) {
          asio::async_write(
              socket,
              boost::asio::buffer("Data was recived by server and in future "
                                  "it might be processed\n"),
              [this, self](const boost::system::error_code &e, size_t bt) {
                if (e) {
                  std::cout << "error while writing: " << e.message()
                            << std::endl;
                }

                socket.close();
              });
        }
      });
}
