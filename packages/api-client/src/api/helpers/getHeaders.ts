
// api/helpers/getHeaders
import { Context } from 'src/types';

export default function getHeaders(context: Context) {
  const { getSessionId, getCsrfToken } = context.config.state;

  return {
    ...(getSessionId() && { Cookie: `JSESSIONID=${getSessionId()}` }),
    ...(getCsrfToken() && { 'X-CSRF-TOKEN': getCsrfToken() })
  };
}
