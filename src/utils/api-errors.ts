export function getAPIErrorMessage(error: any): string {
  if (!error) return 'Unknown error.';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error) return error.error;
  if (error.response && error.response.data && error.response.data.error) return error.response.data.error;
  return 'An unknown error occurred.';
}
