#pragma once
#include <boost/asio.hpp>
#include <string>
#include <vector>

enum HttpMethod { GET, POST, PUT, PATCH, DELETE };

struct Request {
  std::string method;
  std::string path;
  std::string version;

  std::unordered_map<std::string, std::string> headers;
  std::string body;
};

struct Route {
  HttpMethod type;
  std::string route_name;
  std::function<void(Request &, boost::asio::ip::tcp::socket &)> handler;
};

class Router {
  std::vector<Route> routes;

public:
  void add(const Route &r);
  const std::vector<Route> &getRoutes() const;
};
