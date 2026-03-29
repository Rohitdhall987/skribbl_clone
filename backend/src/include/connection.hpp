#pragma once
#include "router.hpp"
#include <boost/asio.hpp>
#include <boost/asio/io_context.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/beast/core/string_type.hpp>
#include <boost/beast/http/message_fwd.hpp>
#include <boost/beast/http/string_body_fwd.hpp>
#include <system_error>

namespace {
namespace asio = boost::asio;
namespace ip = boost::asio::ip;
namespace beast = boost::beast;
} // namespace

class Connection : public std::enable_shared_from_this<Connection> {
public:
  Connection(asio::io_context &context);

  void handle_connection(const std::error_code &ec, Router *router);

  ip::tcp::socket socket;
  beast::flat_buffer readBuff;
  beast::http::request<beast::http::string_body> request;
};
