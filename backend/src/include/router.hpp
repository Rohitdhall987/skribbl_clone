#pragma once
#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <boost/beast/http/message_fwd.hpp>
#include <boost/beast/http/string_body_fwd.hpp>
#include <boost/beast/http/verb.hpp>
#include <string>
#include <vector>

namespace {
namespace http = boost::beast::http;
namespace ip = boost::asio::ip;
} // namespace

struct Route {
  http::verb type;
  std::string route_name;
  std::function<void(http::request<http::string_body> &, ip::tcp::socket &)>
      handler;
};

class Router {
  std::vector<Route> routes;

  void add(const Route &r);

public:
  Router();
  const std::vector<Route> &getRoutes() const;
};
