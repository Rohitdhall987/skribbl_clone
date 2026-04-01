#include "../include/utils/query.hpp"
#include <sstream>
std::unordered_map<std::string, std::string> parse_query(std::string target) {
  std::unordered_map<std::string, std::string> params;

  auto pos = target.find('?');
  if (pos == std::string::npos)
    return params;

  std::string query = target.substr(pos + 1);

  std::stringstream ss(query);
  std::string pair;

  while (std::getline(ss, pair, '&')) {
    auto eq = pair.find('=');
    if (eq != std::string::npos) {
      params[pair.substr(0, eq)] = pair.substr(eq + 1);
    }
  }

  return params;
}
