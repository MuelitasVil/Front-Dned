import axios from "axios";
import { env } from "../config/env";

export const httpClient = axios.create({
  baseURL: env.organizationalApiUrl,
  timeout: 30000,
});
