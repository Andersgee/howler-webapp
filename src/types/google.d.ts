/**
 * @see https://developers.google.com/identity/gsi/web/reference/js-reference#GsiButtonConfiguration
 */
interface GsiButtonConfiguration {
  /** The button type. The default value is standard. */
  type?: "standard" | "icon";
  /** The button theme. The default value is outline */
  theme?: "outline" | "filled_blue" | "filled_black";
  /** The button size. The default value is large. */
  size?: "large" | "medium" | "small";
  /** The button text. The default value is signin_with */
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  /** The button shape. The default value is rectangular */
  shape?: "rectangular" | "pill" | "circle" | "square";
  /** The alignment of the Google logo. The default value is left. Only applies to when type standard */
  logo_alignment?: "left" | "center";
  /** The minimum button width, in pixels. The maximum width is 400 pixels. */
  width?: string;
  /** The pre-set locale of the button text. If it's not set, the browser's default locale of the Google session user’s preference is used. */
  locale?: string;
}

interface CredentialResponse {
  /** google idToken as a base64-encoded JSON Web Token (JWT) string. */
  credential: string;
  /**
   * which flow was used to get the credential response.
   *
   * @see https://developers.google.com/identity/gsi/web/reference/js-reference#select_by */
  select_by: string;
}

type ModeConfiguration =
  | {
      ux_mode: "popup";
      /**
       * handle CredentialResponse in javascript if ux_mode is popup
       */
      callback: (response: CredentialResponse) => void;
    }
  | {
      ux_mode: "redirect";
      /**
       * after login with google click, sends a POST request to this url if ux_mode is redirect
       *
       * The url must handle POST requests where request.formData() has `credential`, `client_id` and `g_csrf_token`
       *
       * (the credential value is the actual google idToken jwt)
       */
      login_uri: string;
    };

//https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration
type IdConfiguration = {
  client_id: string;
} & ModeConfiguration;

interface Window {
  google?: {
    accounts: {
      /**
       * minimal typing. see following links for reference / complete interface
       * @see https://developers.google.com/identity/gsi/web/reference/html-reference
       * @see https://developers.google.com/identity/gsi/web/reference/js-reference#GsiButtonConfiguration
       */
      id: {
        initialize: (options: IdConfiguration) => void;
        /** render the "sign in" button */
        renderButton: (
          element: HTMLElement | null,
          options: GsiButtonConfiguration
        ) => void;
        /** prompt the "One Tap" dialog */
        prompt: () => void;
        /** call when sign out */
        disableAutoSelect: () => void;
      };
    };
  };
}
