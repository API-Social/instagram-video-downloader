import axios from "axios";
import { TimeoutException } from "@/exceptions";
import { NextRequest } from "next/server";
import { IAxiosFetchFunction } from "@/types";

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/17.17134",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/18.17763",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/19",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/46",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/47",
];

export const getRandomUserAgent = () => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

export const getHeaders = (cookie?: string) => {
  const HEADERS = {
    "User-Agent": getRandomUserAgent(),
    Cookie: cookie ?? "",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-us,en;q=0.5",
    "Sec-Fetch-Mode": "navigate",
    Referer: "https://www.instagram.com/",
  };

  return HEADERS;
};

export const axiosFetch = async ({
  credentials = false,
  url,
  method = "GET",
  throwError = false,
  headers,
  timeout,
  data,
}: IAxiosFetchFunction) => {
  let response;

  try {
    response = await axios({
      withCredentials: credentials,
      url,
      method,
      headers,
      timeout,
      data,
    });
    return response;
  } catch (error: any) {
    if (error.message.includes("timeout")) {
      throw new TimeoutException();
    }
    if (throwError) {
      throw error;
    } else {
      console.error(error.message);
      return null;
    }
  }
};

export const getClientIp = (request: NextRequest) => {
  let ip = request.ip ?? request.headers.get("x-real-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? null;
    return ip;
  }
  return ip;
};
