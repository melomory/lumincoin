import { HttpUtils } from "../utilities/http-utils";

export class AuthService {
  static async login(data) {
    const result = await HttpUtils.request("/login", "POST", false, data);

    if (
      result.error ||
      !result.response ||
      (result.response &&
        result.response.tokens &&
        (!result.response.tokens.accessToken ||
          !result.response.tokens.refreshToken) &&
        result.response.user &&
        (!result.response.user.id || !result.response.user.name))
    ) {
      return false;
    }

    return result.response;
  }

  static async signup(data) {
    const result = await HttpUtils.request("/signup", "POST", false, data);

    if (
      result.error ||
      !result.response ||
      (result.response &&
        result.response.user &&
        (!result.response.user.id ||
          !result.response.user.email ||
          !result.response.user.name ||
          !result.response.user.lastName))
    ) {
      return false;
    }

    return result.response;
  }

  static async logout(data) {
    await HttpUtils.request("/logout", "POST", false, data);
  }
}
