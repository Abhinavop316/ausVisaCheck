import api from "./api";

/**
 * Creates a new client application.
 * @param {Object} clientData - Object containing client details.
 * @returns {Promise<Object>} The saved client record from backend.
 */
export const createClient = async (clientData) => {
  try {
    const response = await api.post("/clients", clientData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create application.";
    throw new Error(errorMessage);
  }
};

/**
 * Fetches client application details by Email / Passport Number.
 * @param {Object} queryData - Object containing Email and/or PassportNumber / identNum.
 * @returns {Promise<Object>} The client object matching query.
 */
export const getAClients = async (queryData) => {
  try {
    const response = await api.post("/get-client", queryData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to retrieve client status.";
    throw new Error(errorMessage);
  }
};

// Backwards-compatible alias for fetching by identification number
export const getClientByApplicationNumber = async (
  applicationNumber,
  identificationNumber
) => {
  return getAClients({
    PassportNumber: identificationNumber || applicationNumber,
    identNum: applicationNumber,
  });
};