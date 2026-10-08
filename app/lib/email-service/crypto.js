// Utility functions for safe credential handling and masking

export function maskSecret(secret) {
  if (!secret) return "";
  if (secret.length <= 8) return "••••••••";
  const start = secret.slice(0, 4);
  const end = secret.slice(-4);
  return `${start}••••••••${end}`;
}

export function maskProviderCredentials(credentials = {}, providerType) {
  const masked = { ...credentials };
  if (providerType === "aws_ses") {
    if (masked.secret_access_key) masked.secret_access_key = maskSecret(masked.secret_access_key);
    if (masked.access_key_id) masked.access_key_id = maskSecret(masked.access_key_id);
  } else if (providerType === "resend") {
    if (masked.api_key) masked.api_key = maskSecret(masked.api_key);
  } else if (providerType === "smtp") {
    if (masked.password) masked.password = maskSecret(masked.password);
  }
  return masked;
}
