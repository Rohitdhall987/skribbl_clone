#include "../include/utils/responses.hpp"
#include <boost/asio/buffer.hpp>
#include <boost/asio/write.hpp>
#include <string>

namespace {
namespace ip = boost::asio::ip;
}
void Response::send(ip::tcp::socket &soc) {
  std::string response = version + " " + status +
                         "\r\n"
                         "Content-Type: " +
                         content_type + "\r\n\r\n" + content;
  boost::asio::write(soc, boost::asio::buffer(response));
  soc.close();
}
void Response::err(ip::tcp::socket &soc, std::string msg) {

  std::string res = "HTTP/1.1 400 Bad Request\r\n"
                    "Content-Type: application/json\r\n\r\n"
                    "{"
                    "\"message\": \"" +
                    msg + "\"}";
  boost::asio::write(soc, boost::asio::buffer(res));
  soc.close();
}
