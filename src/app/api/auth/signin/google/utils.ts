//using url.searchparams.append encodes space as plus instead of %20 among other things
export function urlWithEncodedParams(
  url: string,
  params: Record<string, string>
) {
  const u = new URL(url);
  u.search = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return u.toString();
}

//authentication request to Google
/*
    const url = urlWithEncodedParams(
      "https://accounts.google.com/o/oauth2/v2/auth",
      {
        client_id: "MYCLIENTID",
        response_type: "code",
        scope: "openid email profile",
        redirect_uri: "http://localhost/auth/ca",
        state: "hmmm",
      }
    );

    console.log("url:", url.toString());
*/
