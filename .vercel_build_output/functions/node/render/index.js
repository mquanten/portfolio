var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData
});
function _fileName(headerValue) {
  const m2 = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!m2) {
    return;
  }
  const match = m2[2] || m2[3] || "";
  let filename = match.slice(match.lastIndexOf("\\") + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m3, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct) {
  if (!/multipart/i.test(ct)) {
    throw new TypeError("Failed to fetch");
  }
  const m2 = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m2) {
    throw new TypeError("no or bad content-type header, no multipart boundary");
  }
  const parser = new MultipartParser(m2[1] || m2[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData();
  const onPartData = (ui8a) => {
    entryValue += decoder.decode(ui8a, { stream: true });
  };
  const appendToFile = (ui8a) => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new File(entryChunks, filename, { type: contentType });
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder("utf-8");
  decoder.decode();
  parser.onPartBegin = function() {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = "";
    headerValue = "";
    entryValue = "";
    entryName = "";
    contentType = "";
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function(ui8a) {
    headerField += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderValue = function(ui8a) {
    headerValue += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderEnd = function() {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === "content-disposition") {
      const m3 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      if (m3) {
        entryName = m3[2] || m3[3] || "";
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === "content-type") {
      contentType = headerValue;
    }
    headerValue = "";
    headerField = "";
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}
var s, S, f, F, LF, CR, SPACE, HYPHEN, COLON, A, Z, lower, noop, MultipartParser;
var init_multipart_parser = __esm({
  "node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js"() {
    init_polyfills();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    f = 1;
    F = {
      PART_BOUNDARY: f,
      LAST_BOUNDARY: f *= 2
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A = 97;
    Z = 122;
    lower = (c) => c | 32;
    noop = () => {
    };
    MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index: index24, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i2;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state) {
            case S.START_BOUNDARY:
              if (index24 === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index24++;
                break;
              } else if (index24 - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index24 = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index24 + 2]) {
                index24 = -2;
              }
              if (c === boundary[index24 + 2]) {
                index24++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index24 = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index24++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index24 === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            case S.PART_DATA:
              previousIndex = index24;
              if (index24 === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index24 < boundary.length) {
                if (boundary[index24] === c) {
                  if (index24 === 0) {
                    dataCallback("onPartData", true);
                  }
                  index24++;
                } else {
                  index24 = 0;
                }
              } else if (index24 === boundary.length) {
                index24++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index24 = 0;
                }
              } else if (index24 - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index24 = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index24 = 0;
                  }
                } else {
                  index24 = 0;
                }
              }
              if (index24 > 0) {
                lookbehind[index24 - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index24;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
  }
});

// node_modules/@sveltejs/kit/dist/node/polyfills.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base642 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base642 = true;
    } else {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base642 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* toIterator(parts, clone2) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0, b = part;
      while (position !== b.size) {
        const chunk = b.slice(position, Math.min(b.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
function formDataToBlob(F2, B = Blob$1) {
  var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
  F2.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b}--`);
  return new B(c, { type: "multipart/form-data; boundary=" + b });
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  const { body } = data;
  if (body === null) {
    return import_node_buffer.Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream.default)) {
    return import_node_buffer.Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error2 = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error2);
        throw error2;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    const error_ = error2 instanceof FetchBaseError ? error2 : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return import_node_buffer.Buffer.from(accum.join(""));
      }
      return import_node_buffer.Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers2(headers.reduce((result, value, index24, array2) => {
    if (index24 % 2 === 0) {
      result.push(array2.slice(index24, index24 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_node_net.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (/^(.+\.)*localhost$/.test(url.host)) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}
function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
    return null;
  }
  const policy = request.referrerPolicy;
  if (request.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers) {
  const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}
async function fetch2(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request2(url, options_);
    const { parsedURL, options } = getNodeRequestOptions(request);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dataUriToBuffer(request.url);
      const response2 = new Response2(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https.default : import_node_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_node_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(parsedURL.toString(), options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error2) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error2.message}`, "system", error2));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error2) => {
      response.body.destroy(error2);
    });
    if (process.version < "v14") {
      request_.on("socket", (s3) => {
        let endedWithEventsCount;
        s3.prependListener("end", () => {
          endedWithEventsCount = s3._eventsCount;
        });
        s3.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s3._eventsCount && !hadError) {
            const error2 = new Error("Premature close");
            error2.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error2);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        let locationURL = null;
        try {
          locationURL = location === null ? null : new URL(location, request.url);
        } catch {
          if (request.redirect !== "manual") {
            reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
            finalize();
            return;
          }
        }
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers2(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: clone(request),
              signal: request.signal,
              size: request.size,
              referrer: request.referrer,
              referrerPolicy: request.referrerPolicy
            };
            if (!isDomainOrSubdomain(request.url, locationURL)) {
              for (const name of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                requestOptions.headers.delete(name);
              }
            }
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_node_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
            }
            resolve2(fetch2(new Request2(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), (error2) => {
        if (error2) {
          reject(error2);
        }
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_node_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createGunzip(zlibOptions), (error2) => {
          if (error2) {
            reject(error2);
          }
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), (error2) => {
          if (error2) {
            reject(error2);
          }
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflate(), (error2) => {
              if (error2) {
                reject(error2);
              }
            });
          } else {
            body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflateRaw(), (error2) => {
              if (error2) {
                reject(error2);
              }
            });
          }
          response = new Response2(body, responseOptions);
          resolve2(response);
        });
        raw.once("end", () => {
          if (!response) {
            response = new Response2(body, responseOptions);
            resolve2(response);
          }
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createBrotliDecompress(), (error2) => {
          if (error2) {
            reject(error2);
          }
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response2(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request).catch(reject);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = import_node_buffer.Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error2 = new Error("Premature close");
        error2.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error2);
      }
    };
    socket.prependListener("close", onSocketClose);
    request.on("abort", () => {
      socket.removeListener("close", onSocketClose);
    });
    socket.on("data", (buf) => {
      properLastChunkReceived = import_node_buffer.Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = import_node_buffer.Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && import_node_buffer.Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    });
  });
}
function installPolyfills() {
  for (const name in globals) {
    Object.defineProperty(globalThis, name, {
      enumerable: true,
      configurable: true,
      value: globals[name]
    });
  }
}
var import_node_http, import_node_https, import_node_zlib, import_node_stream, import_node_buffer, import_node_util, import_node_url, import_node_net, import_crypto, commonjsGlobal, ponyfill_es2018, POOL_SIZE$1, POOL_SIZE, _Blob, Blob2, Blob$1, _File, File, t, i, h, r, m, f2, e, x, FormData, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, isDomainOrSubdomain, pipeline, INTERNALS$2, Body, clone, getNonSpecFormDataBoundary, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers2, redirectStatus, isRedirect, INTERNALS$1, Response2, getSearch, ReferrerPolicy, DEFAULT_REFERRER_POLICY, INTERNALS, isRequest, doBadDataWarn, Request2, getNodeRequestOptions, AbortError, supportedSchemas, globals;
var init_polyfills = __esm({
  "node_modules/@sveltejs/kit/dist/node/polyfills.js"() {
    import_node_http = __toESM(require("node:http"), 1);
    import_node_https = __toESM(require("node:https"), 1);
    import_node_zlib = __toESM(require("node:zlib"), 1);
    import_node_stream = __toESM(require("node:stream"), 1);
    import_node_buffer = require("node:buffer");
    import_node_util = require("node:util");
    import_node_url = require("node:url");
    import_node_net = require("node:net");
    import_crypto = require("crypto");
    commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    ponyfill_es2018 = { exports: {} };
    (function(module2, exports) {
      (function(global2, factory) {
        factory(exports);
      })(commonjsGlobal, function(exports2) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop4() {
          return void 0;
        }
        function getGlobals() {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else if (typeof commonjsGlobal !== "undefined") {
            return commonjsGlobal;
          }
          return void 0;
        }
        const globals2 = getGlobals();
        function typeIsObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        const rethrowAssertionErrorRejection = noop4;
        const originalPromise = Promise;
        const originalPromiseThen = Promise.prototype.then;
        const originalPromiseResolve = Promise.resolve.bind(originalPromise);
        const originalPromiseReject = Promise.reject.bind(originalPromise);
        function newPromise(executor) {
          return new originalPromise(executor);
        }
        function promiseResolvedWith(value) {
          return originalPromiseResolve(value);
        }
        function promiseRejectedWith(reason) {
          return originalPromiseReject(reason);
        }
        function PerformPromiseThen(promise, onFulfilled, onRejected) {
          return originalPromiseThen.call(promise, onFulfilled, onRejected);
        }
        function uponPromise(promise, onFulfilled, onRejected) {
          PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
        }
        function uponFulfillment(promise, onFulfilled) {
          uponPromise(promise, onFulfilled);
        }
        function uponRejection(promise, onRejected) {
          uponPromise(promise, void 0, onRejected);
        }
        function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
          return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
        }
        function setPromiseIsHandledToTrue(promise) {
          PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
        }
        const queueMicrotask = (() => {
          const globalQueueMicrotask = globals2 && globals2.queueMicrotask;
          if (typeof globalQueueMicrotask === "function") {
            return globalQueueMicrotask;
          }
          const resolvedPromise = promiseResolvedWith(void 0);
          return (fn) => PerformPromiseThen(resolvedPromise, fn);
        })();
        function reflectCall(F2, V, args) {
          if (typeof F2 !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F2, V, args);
        }
        function promiseCall(F2, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F2, V, args));
          } catch (value) {
            return promiseRejectedWith(value);
          }
        }
        const QUEUE_MAX_ARRAY_SIZE = 16384;
        class SimpleQueue {
          constructor() {
            this._cursor = 0;
            this._size = 0;
            this._front = {
              _elements: [],
              _next: void 0
            };
            this._back = this._front;
            this._cursor = 0;
            this._size = 0;
          }
          get length() {
            return this._size;
          }
          push(element) {
            const oldBack = this._back;
            let newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
              newBack = {
                _elements: [],
                _next: void 0
              };
            }
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
              this._back = newBack;
              oldBack._next = newBack;
            }
            ++this._size;
          }
          shift() {
            const oldFront = this._front;
            let newFront = oldFront;
            const oldCursor = this._cursor;
            let newCursor = oldCursor + 1;
            const elements = oldFront._elements;
            const element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
              newFront = oldFront._next;
              newCursor = 0;
            }
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
              this._front = newFront;
            }
            elements[oldCursor] = void 0;
            return element;
          }
          forEach(callback) {
            let i2 = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i2 !== elements.length || node._next !== void 0) {
              if (i2 === elements.length) {
                node = node._next;
                elements = node._elements;
                i2 = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i2]);
              ++i2;
            }
          }
          peek() {
            const front = this._front;
            const cursor = this._cursor;
            return front._elements[cursor];
          }
        }
        function ReadableStreamReaderGenericInitialize(reader, stream) {
          reader._ownerReadableStream = stream;
          stream._reader = reader;
          if (stream._state === "readable") {
            defaultReaderClosedPromiseInitialize(reader);
          } else if (stream._state === "closed") {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
          } else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
          }
        }
        function ReadableStreamReaderGenericCancel(reader, reason) {
          const stream = reader._ownerReadableStream;
          return ReadableStreamCancel(stream, reason);
        }
        function ReadableStreamReaderGenericRelease(reader) {
          if (reader._ownerReadableStream._state === "readable") {
            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          } else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          }
          reader._ownerReadableStream._reader = void 0;
          reader._ownerReadableStream = void 0;
        }
        function readerLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released reader");
        }
        function defaultReaderClosedPromiseInitialize(reader) {
          reader._closedPromise = newPromise((resolve2, reject) => {
            reader._closedPromise_resolve = resolve2;
            reader._closedPromise_reject = reject;
          });
        }
        function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseReject(reader, reason);
        }
        function defaultReaderClosedPromiseInitializeAsResolved(reader) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseResolve(reader);
        }
        function defaultReaderClosedPromiseReject(reader, reason) {
          if (reader._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(reader._closedPromise);
          reader._closedPromise_reject(reason);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        function defaultReaderClosedPromiseResetToRejected(reader, reason) {
          defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
        }
        function defaultReaderClosedPromiseResolve(reader) {
          if (reader._closedPromise_resolve === void 0) {
            return;
          }
          reader._closedPromise_resolve(void 0);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
        const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
        const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
        const PullSteps = SymbolPolyfill("[[PullSteps]]");
        const NumberIsFinite = Number.isFinite || function(x2) {
          return typeof x2 === "number" && isFinite(x2);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x2) {
          return typeof x2 === "object" || typeof x2 === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x2, context) {
          if (typeof x2 !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        function assertObject(x2, context) {
          if (!isObject(x2)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x2, position, context) {
          if (x2 === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x2, field, context) {
          if (x2 === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x2) {
          return x2 === 0 ? 0 : x2;
        }
        function integerPart(x2) {
          return censorNegativeZero(MathTrunc(x2));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x2 = Number(value);
          x2 = censorNegativeZero(x2);
          if (!NumberIsFinite(x2)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x2 = integerPart(x2);
          if (x2 < lowerBound || x2 > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x2) || x2 === 0) {
            return 0;
          }
          return x2;
        }
        function assertReadableStream(x2, context) {
          if (!IsReadableStream(x2)) {
            throw new TypeError(`${context} is not a ReadableStream.`);
          }
        }
        function AcquireReadableStreamDefaultReader(stream) {
          return new ReadableStreamDefaultReader(stream);
        }
        function ReadableStreamAddReadRequest(stream, readRequest) {
          stream._reader._readRequests.push(readRequest);
        }
        function ReadableStreamFulfillReadRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readRequest = reader._readRequests.shift();
          if (done) {
            readRequest._closeSteps();
          } else {
            readRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadRequests(stream) {
          return stream._reader._readRequests.length;
        }
        function ReadableStreamHasDefaultReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamDefaultReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamDefaultReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("read"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: () => resolvePromise({ value: void 0, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamDefaultReader(this)) {
              throw defaultReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamDefaultReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultReader",
            configurable: true
          });
        }
        function IsReadableStreamDefaultReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultReader;
        }
        function ReadableStreamDefaultReaderRead(reader, readRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "closed") {
            readRequest._closeSteps();
          } else if (stream._state === "errored") {
            readRequest._errorSteps(stream._storedError);
          } else {
            stream._readableStreamController[PullSteps](readRequest);
          }
        }
        function defaultReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
        }
        const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
        }).prototype);
        class ReadableStreamAsyncIteratorImpl {
          constructor(reader, preventCancel) {
            this._ongoingPromise = void 0;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
          }
          next() {
            const nextSteps = () => this._nextSteps();
            this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
            return this._ongoingPromise;
          }
          return(value) {
            const returnSteps = () => this._returnSteps(value);
            return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
          }
          _nextSteps() {
            if (this._isFinished) {
              return Promise.resolve({ value: void 0, done: true });
            }
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("iterate"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => {
                this._ongoingPromise = void 0;
                queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
              },
              _closeSteps: () => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                resolvePromise({ value: void 0, done: true });
              },
              _errorSteps: (reason) => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                rejectPromise(reason);
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
          }
          _returnSteps(value) {
            if (this._isFinished) {
              return Promise.resolve({ value, done: true });
            }
            this._isFinished = true;
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("finish iterating"));
            }
            if (!this._preventCancel) {
              const result = ReadableStreamReaderGenericCancel(reader, value);
              ReadableStreamReaderGenericRelease(reader);
              return transformPromiseWith(result, () => ({ value, done: true }));
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value, done: true });
          }
        }
        const ReadableStreamAsyncIteratorPrototype = {
          next() {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
            }
            return this._asyncIteratorImpl.next();
          },
          return(value) {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
            }
            return this._asyncIteratorImpl.return(value);
          }
        };
        if (AsyncIteratorPrototype !== void 0) {
          Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
        }
        function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
          const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
          iterator._asyncIteratorImpl = impl;
          return iterator;
        }
        function IsReadableStreamAsyncIterator(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x2) {
          return x2 !== x2;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
        }
        function TransferArrayBuffer(O) {
          return O;
        }
        function IsDetachedBuffer(O) {
          return false;
        }
        function ArrayBufferSlice(buffer, begin, end) {
          if (buffer.slice) {
            return buffer.slice(begin, end);
          }
          const length = end - begin;
          const slice = new ArrayBuffer(length);
          CopyDataBlockBytes(slice, 0, buffer, begin, length);
          return slice;
        }
        function IsNonNegativeNumber(v) {
          if (typeof v !== "number") {
            return false;
          }
          if (NumberIsNaN(v)) {
            return false;
          }
          if (v < 0) {
            return false;
          }
          return true;
        }
        function CloneAsUint8Array(O) {
          const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
          return new Uint8Array(buffer);
        }
        function DequeueValue(container) {
          const pair = container._queue.shift();
          container._queueTotalSize -= pair.size;
          if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
          }
          return pair.value;
        }
        function EnqueueValueWithSize(container, value, size) {
          if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
          }
          container._queue.push({ value, size });
          container._queueTotalSize += size;
        }
        function PeekQueueValue(container) {
          const pair = container._queue.peek();
          return pair.value;
        }
        function ResetQueue(container) {
          container._queue = new SimpleQueue();
          container._queueTotalSize = 0;
        }
        class ReadableStreamBYOBRequest {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get view() {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("view");
            }
            return this._view;
          }
          respond(bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respond");
            }
            assertRequiredArgument(bytesWritten, 1, "respond");
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(this._view.buffer))
              ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
          }
          respondWithNewView(view) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respondWithNewView");
            }
            assertRequiredArgument(view, 1, "respondWithNewView");
            if (!ArrayBuffer.isView(view)) {
              throw new TypeError("You can only respond with array buffer views");
            }
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
          }
        }
        Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
          respond: { enumerable: true },
          respondWithNewView: { enumerable: true },
          view: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBRequest",
            configurable: true
          });
        }
        class ReadableByteStreamController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get byobRequest() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("byobRequest");
            }
            return ReadableByteStreamControllerGetBYOBRequest(this);
          }
          get desiredSize() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("desiredSize");
            }
            return ReadableByteStreamControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("close");
            }
            if (this._closeRequested) {
              throw new TypeError("The stream has already been closed; do not close it again!");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
            }
            ReadableByteStreamControllerClose(this);
          }
          enqueue(chunk) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("enqueue");
            }
            assertRequiredArgument(chunk, 1, "enqueue");
            if (!ArrayBuffer.isView(chunk)) {
              throw new TypeError("chunk must be an array buffer view");
            }
            if (chunk.byteLength === 0) {
              throw new TypeError("chunk must have non-zero byteLength");
            }
            if (chunk.buffer.byteLength === 0) {
              throw new TypeError(`chunk's buffer must have non-zero byteLength`);
            }
            if (this._closeRequested) {
              throw new TypeError("stream is closed or draining");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
              const entry24 = this._queue.shift();
              this._queueTotalSize -= entry24.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry24.buffer, entry24.byteOffset, entry24.byteLength);
              readRequest._chunkSteps(view);
              return;
            }
            const autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== void 0) {
              let buffer;
              try {
                buffer = new ArrayBuffer(autoAllocateChunkSize);
              } catch (bufferE) {
                readRequest._errorSteps(bufferE);
                return;
              }
              const pullIntoDescriptor = {
                buffer,
                bufferByteLength: autoAllocateChunkSize,
                byteOffset: 0,
                byteLength: autoAllocateChunkSize,
                bytesFilled: 0,
                elementSize: 1,
                viewConstructor: Uint8Array,
                readerType: "default"
              };
              this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
          }
        }
        Object.defineProperties(ReadableByteStreamController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          byobRequest: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableByteStreamController",
            configurable: true
          });
        }
        function IsReadableByteStreamController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
            return false;
          }
          return x2 instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBRequest;
        }
        function ReadableByteStreamControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableByteStreamControllerError(controller, e2);
          });
        }
        function ReadableByteStreamControllerClearPendingPullIntos(controller) {
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          controller._pendingPullIntos = new SimpleQueue();
        }
        function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
          let done = false;
          if (stream._state === "closed") {
            done = true;
          }
          const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
          if (pullIntoDescriptor.readerType === "default") {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
          } else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
          }
        }
        function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
          const bytesFilled = pullIntoDescriptor.bytesFilled;
          const elementSize = pullIntoDescriptor.elementSize;
          return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
        }
        function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
          controller._queue.push({ buffer, byteOffset, byteLength });
          controller._queueTotalSize += byteLength;
        }
        function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
          const elementSize = pullIntoDescriptor.elementSize;
          const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
          const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
          const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
          const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
          let totalBytesToCopyRemaining = maxBytesToCopy;
          let ready = false;
          if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
          }
          const queue = controller._queue;
          while (totalBytesToCopyRemaining > 0) {
            const headOfQueue = queue.peek();
            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
              queue.shift();
            } else {
              headOfQueue.byteOffset += bytesToCopy;
              headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
          }
          return ready;
        }
        function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
          pullIntoDescriptor.bytesFilled += size;
        }
        function ReadableByteStreamControllerHandleQueueDrain(controller) {
          if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
          } else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }
        function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
          if (controller._byobRequest === null) {
            return;
          }
          controller._byobRequest._associatedReadableByteStreamController = void 0;
          controller._byobRequest._view = null;
          controller._byobRequest = null;
        }
        function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
          while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
              return;
            }
            const pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
          const stream = controller._controlledReadableByteStream;
          let elementSize = 1;
          if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
          }
          const ctor = view.constructor;
          const buffer = TransferArrayBuffer(view.buffer);
          const pullIntoDescriptor = {
            buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize,
            viewConstructor: ctor,
            readerType: "byob"
          };
          if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
          }
          if (stream._state === "closed") {
            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
          }
          if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              ReadableByteStreamControllerHandleQueueDrain(controller);
              readIntoRequest._chunkSteps(filledView);
              return;
            }
            if (controller._closeRequested) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              readIntoRequest._errorSteps(e2);
              return;
            }
          }
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
          const stream = controller._controlledReadableByteStream;
          if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
          if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
          }
          ReadableByteStreamControllerShiftPendingPullInto(controller);
          const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
          if (remainderSize > 0) {
            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
          }
          pullIntoDescriptor.bytesFilled -= remainderSize;
          ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }
        function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            ReadableByteStreamControllerRespondInClosedState(controller);
          } else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerShiftPendingPullInto(controller) {
          const descriptor = controller._pendingPullIntos.shift();
          return descriptor;
        }
        function ReadableByteStreamControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return false;
          }
          if (controller._closeRequested) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableByteStreamControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
        }
        function ReadableByteStreamControllerClose(controller) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
          }
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              throw e2;
            }
          }
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
        function ReadableByteStreamControllerEnqueue(controller, chunk) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          const buffer = chunk.buffer;
          const byteOffset = chunk.byteOffset;
          const byteLength = chunk.byteLength;
          const transferredBuffer = TransferArrayBuffer(buffer);
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer))
              ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            } else {
              if (controller._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
              }
              const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
              ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
          } else if (ReadableStreamHasBYOBReader(stream)) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          } else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerError(controller, e2) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableByteStreamControllerGetBYOBRequest(controller) {
          if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
          }
          return controller._byobRequest;
        }
        function ReadableByteStreamControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableByteStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableByteStreamControllerRespond(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (bytesWritten !== 0) {
              throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            }
          } else {
            if (bytesWritten === 0) {
              throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
              throw new RangeError("bytesWritten out of range");
            }
          }
          firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
          ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
        }
        function ReadableByteStreamControllerRespondWithNewView(controller, view) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (view.byteLength !== 0) {
              throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            }
          } else {
            if (view.byteLength === 0) {
              throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            }
          }
          if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError("The region specified by view does not match byobRequest");
          }
          if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError("The buffer of view has different capacity than byobRequest");
          }
          if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError("The region specified by view is larger than byobRequest");
          }
          const viewByteLength = view.byteLength;
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
        }
        function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
          controller._controlledReadableByteStream = stream;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._byobRequest = null;
          controller._queue = controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._closeRequested = false;
          controller._started = false;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          controller._autoAllocateChunkSize = autoAllocateChunkSize;
          controller._pendingPullIntos = new SimpleQueue();
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableByteStreamControllerError(controller, r2);
          });
        }
        function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
          const controller = Object.create(ReadableByteStreamController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingByteSource.start !== void 0) {
            startAlgorithm = () => underlyingByteSource.start(controller);
          }
          if (underlyingByteSource.pull !== void 0) {
            pullAlgorithm = () => underlyingByteSource.pull(controller);
          }
          if (underlyingByteSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
          }
          const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
          if (autoAllocateChunkSize === 0) {
            throw new TypeError("autoAllocateChunkSize must be greater than 0");
          }
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
        }
        function SetUpReadableStreamBYOBRequest(request, controller, view) {
          request._associatedReadableByteStreamController = controller;
          request._view = view;
        }
        function byobRequestBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
        }
        function byteStreamControllerBrandCheckException(name) {
          return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
        }
        function AcquireReadableStreamBYOBReader(stream) {
          return new ReadableStreamBYOBReader(stream);
        }
        function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
          stream._reader._readIntoRequests.push(readIntoRequest);
        }
        function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readIntoRequest = reader._readIntoRequests.shift();
          if (done) {
            readIntoRequest._closeSteps(chunk);
          } else {
            readIntoRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadIntoRequests(stream) {
          return stream._reader._readIntoRequests.length;
        }
        function ReadableStreamHasBYOBReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamBYOBReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamBYOBReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
              throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read(view) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("read"));
            }
            if (!ArrayBuffer.isView(view)) {
              return promiseRejectedWith(new TypeError("view must be an array buffer view"));
            }
            if (view.byteLength === 0) {
              return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
            }
            if (view.buffer.byteLength === 0) {
              return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readIntoRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamBYOBReader(this)) {
              throw byobReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readIntoRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamBYOBReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBReader",
            configurable: true
          });
        }
        function IsReadableStreamBYOBReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBReader;
        }
        function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "errored") {
            readIntoRequest._errorSteps(stream._storedError);
          } else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
          }
        }
        function byobReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
        }
        function ExtractHighWaterMark(strategy, defaultHWM) {
          const { highWaterMark } = strategy;
          if (highWaterMark === void 0) {
            return defaultHWM;
          }
          if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError("Invalid highWaterMark");
          }
          return highWaterMark;
        }
        function ExtractSizeAlgorithm(strategy) {
          const { size } = strategy;
          if (!size) {
            return () => 1;
          }
          return size;
        }
        function convertQueuingStrategy(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
          return {
            highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
            size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
          };
        }
        function convertQueuingStrategySize(fn, context) {
          assertFunction(fn, context);
          return (chunk) => convertUnrestrictedDouble(fn(chunk));
        }
        function convertUnderlyingSink(original, context) {
          assertDictionary(original, context);
          const abort = original === null || original === void 0 ? void 0 : original.abort;
          const close = original === null || original === void 0 ? void 0 : original.close;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          const write = original === null || original === void 0 ? void 0 : original.write;
          return {
            abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
            close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
            write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
            type
          };
        }
        function convertUnderlyingSinkAbortCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSinkCloseCallback(fn, original, context) {
          assertFunction(fn, context);
          return () => promiseCall(fn, original, []);
        }
        function convertUnderlyingSinkStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertUnderlyingSinkWriteCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        function assertWritableStream(x2, context) {
          if (!IsWritableStream(x2)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a) {
            return false;
          }
        }
        const supportsAbortController = typeof AbortController === "function";
        function createAbortController() {
          if (supportsAbortController) {
            return new AbortController();
          }
          return void 0;
        }
        class WritableStream {
          constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
            if (rawUnderlyingSink === void 0) {
              rawUnderlyingSink = null;
            } else {
              assertObject(rawUnderlyingSink, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
            InitializeWritableStream(this);
            const type = underlyingSink.type;
            if (type !== void 0) {
              throw new RangeError("Invalid type is specified");
            }
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
          }
          get locked() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("locked");
            }
            return IsWritableStreamLocked(this);
          }
          abort(reason = void 0) {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("abort"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
            }
            return WritableStreamAbort(this, reason);
          }
          close() {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("close"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamClose(this);
          }
          getWriter() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("getWriter");
            }
            return AcquireWritableStreamDefaultWriter(this);
          }
        }
        Object.defineProperties(WritableStream.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          getWriter: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStream",
            configurable: true
          });
        }
        function AcquireWritableStreamDefaultWriter(stream) {
          return new WritableStreamDefaultWriter(stream);
        }
        function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(WritableStream.prototype);
          InitializeWritableStream(stream);
          const controller = Object.create(WritableStreamDefaultController.prototype);
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function InitializeWritableStream(stream) {
          stream._state = "writable";
          stream._storedError = void 0;
          stream._writer = void 0;
          stream._writableStreamController = void 0;
          stream._writeRequests = new SimpleQueue();
          stream._inFlightWriteRequest = void 0;
          stream._closeRequest = void 0;
          stream._inFlightCloseRequest = void 0;
          stream._pendingAbortRequest = void 0;
          stream._backpressure = false;
        }
        function IsWritableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
            return false;
          }
          return x2 instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseResolvedWith(void 0);
          }
          if (stream._pendingAbortRequest !== void 0) {
            return stream._pendingAbortRequest._promise;
          }
          let wasAlreadyErroring = false;
          if (state === "erroring") {
            wasAlreadyErroring = true;
            reason = void 0;
          }
          const promise = newPromise((resolve2, reject) => {
            stream._pendingAbortRequest = {
              _promise: void 0,
              _resolve: resolve2,
              _reject: reject,
              _reason: reason,
              _wasAlreadyErroring: wasAlreadyErroring
            };
          });
          stream._pendingAbortRequest._promise = promise;
          if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
          }
          return promise;
        }
        function WritableStreamClose(stream) {
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
          }
          const promise = newPromise((resolve2, reject) => {
            const closeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._closeRequest = closeRequest;
          });
          const writer = stream._writer;
          if (writer !== void 0 && stream._backpressure && state === "writable") {
            defaultWriterReadyPromiseResolve(writer);
          }
          WritableStreamDefaultControllerClose(stream._writableStreamController);
          return promise;
        }
        function WritableStreamAddWriteRequest(stream) {
          const promise = newPromise((resolve2, reject) => {
            const writeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._writeRequests.push(writeRequest);
          });
          return promise;
        }
        function WritableStreamDealWithRejection(stream, error2) {
          const state = stream._state;
          if (state === "writable") {
            WritableStreamStartErroring(stream, error2);
            return;
          }
          WritableStreamFinishErroring(stream);
        }
        function WritableStreamStartErroring(stream, reason) {
          const controller = stream._writableStreamController;
          stream._state = "erroring";
          stream._storedError = reason;
          const writer = stream._writer;
          if (writer !== void 0) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
          }
          if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
          }
        }
        function WritableStreamFinishErroring(stream) {
          stream._state = "errored";
          stream._writableStreamController[ErrorSteps]();
          const storedError = stream._storedError;
          stream._writeRequests.forEach((writeRequest) => {
            writeRequest._reject(storedError);
          });
          stream._writeRequests = new SimpleQueue();
          if (stream._pendingAbortRequest === void 0) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const abortRequest = stream._pendingAbortRequest;
          stream._pendingAbortRequest = void 0;
          if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
          uponPromise(promise, () => {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          }, (reason) => {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          });
        }
        function WritableStreamFinishInFlightWrite(stream) {
          stream._inFlightWriteRequest._resolve(void 0);
          stream._inFlightWriteRequest = void 0;
        }
        function WritableStreamFinishInFlightWriteWithError(stream, error2) {
          stream._inFlightWriteRequest._reject(error2);
          stream._inFlightWriteRequest = void 0;
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamFinishInFlightClose(stream) {
          stream._inFlightCloseRequest._resolve(void 0);
          stream._inFlightCloseRequest = void 0;
          const state = stream._state;
          if (state === "erroring") {
            stream._storedError = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._resolve();
              stream._pendingAbortRequest = void 0;
            }
          }
          stream._state = "closed";
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseResolve(writer);
          }
        }
        function WritableStreamFinishInFlightCloseWithError(stream, error2) {
          stream._inFlightCloseRequest._reject(error2);
          stream._inFlightCloseRequest = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._reject(error2);
            stream._pendingAbortRequest = void 0;
          }
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamCloseQueuedOrInFlight(stream) {
          if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamHasOperationMarkedInFlight(stream) {
          if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamMarkCloseRequestInFlight(stream) {
          stream._inFlightCloseRequest = stream._closeRequest;
          stream._closeRequest = void 0;
        }
        function WritableStreamMarkFirstWriteRequestInFlight(stream) {
          stream._inFlightWriteRequest = stream._writeRequests.shift();
        }
        function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
          if (stream._closeRequest !== void 0) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = void 0;
          }
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
          }
        }
        function WritableStreamUpdateBackpressure(stream, backpressure) {
          const writer = stream._writer;
          if (writer !== void 0 && backpressure !== stream._backpressure) {
            if (backpressure) {
              defaultWriterReadyPromiseReset(writer);
            } else {
              defaultWriterReadyPromiseResolve(writer);
            }
          }
          stream._backpressure = backpressure;
        }
        class WritableStreamDefaultWriter {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
            assertWritableStream(stream, "First parameter");
            if (IsWritableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive writing by another writer");
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            const state = stream._state;
            if (state === "writable") {
              if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                defaultWriterReadyPromiseInitialize(this);
              } else {
                defaultWriterReadyPromiseInitializeAsResolved(this);
              }
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "erroring") {
              defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "closed") {
              defaultWriterReadyPromiseInitializeAsResolved(this);
              defaultWriterClosedPromiseInitializeAsResolved(this);
            } else {
              const storedError = stream._storedError;
              defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
              defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
          }
          get closed() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          get desiredSize() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("desiredSize");
            }
            if (this._ownerWritableStream === void 0) {
              throw defaultWriterLockException("desiredSize");
            }
            return WritableStreamDefaultWriterGetDesiredSize(this);
          }
          get ready() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
            }
            return this._readyPromise;
          }
          abort(reason = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("abort"));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
          }
          close() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("close"));
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("close"));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamDefaultWriterClose(this);
          }
          releaseLock() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("releaseLock");
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return;
            }
            WritableStreamDefaultWriterRelease(this);
          }
          write(chunk = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("write"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
          }
        }
        Object.defineProperties(WritableStreamDefaultWriter.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          releaseLock: { enumerable: true },
          write: { enumerable: true },
          closed: { enumerable: true },
          desiredSize: { enumerable: true },
          ready: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultWriter",
            configurable: true
          });
        }
        function IsWritableStreamDefaultWriter(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultWriter;
        }
        function WritableStreamDefaultWriterAbort(writer, reason) {
          const stream = writer._ownerWritableStream;
          return WritableStreamAbort(stream, reason);
        }
        function WritableStreamDefaultWriterClose(writer) {
          const stream = writer._ownerWritableStream;
          return WritableStreamClose(stream);
        }
        function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          return WritableStreamDefaultWriterClose(writer);
        }
        function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error2) {
          if (writer._closedPromiseState === "pending") {
            defaultWriterClosedPromiseReject(writer, error2);
          } else {
            defaultWriterClosedPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error2) {
          if (writer._readyPromiseState === "pending") {
            defaultWriterReadyPromiseReject(writer, error2);
          } else {
            defaultWriterReadyPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterGetDesiredSize(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (state === "errored" || state === "erroring") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
        }
        function WritableStreamDefaultWriterRelease(writer) {
          const stream = writer._ownerWritableStream;
          const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
          WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
          stream._writer = void 0;
          writer._ownerWritableStream = void 0;
        }
        function WritableStreamDefaultWriterWrite(writer, chunk) {
          const stream = writer._ownerWritableStream;
          const controller = stream._writableStreamController;
          const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
          if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          const state = stream._state;
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
          }
          if (state === "erroring") {
            return promiseRejectedWith(stream._storedError);
          }
          const promise = WritableStreamAddWriteRequest(stream);
          WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
          return promise;
        }
        const closeSentinel = {};
        class WritableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get abortReason() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("abortReason");
            }
            return this._abortReason;
          }
          get signal() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("signal");
            }
            if (this._abortController === void 0) {
              throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
            }
            return this._abortController.signal;
          }
          error(e2 = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e2);
          }
          [AbortSteps](reason) {
            const result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [ErrorSteps]() {
            ResetQueue(this);
          }
        }
        Object.defineProperties(WritableStreamDefaultController.prototype, {
          abortReason: { enumerable: true },
          signal: { enumerable: true },
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultController;
        }
        function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledWritableStream = stream;
          stream._writableStreamController = controller;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._abortReason = void 0;
          controller._abortController = createAbortController();
          controller._started = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._writeAlgorithm = writeAlgorithm;
          controller._closeAlgorithm = closeAlgorithm;
          controller._abortAlgorithm = abortAlgorithm;
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
          const startResult = startAlgorithm();
          const startPromise = promiseResolvedWith(startResult);
          uponPromise(startPromise, () => {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (r2) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r2);
          });
        }
        function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(WritableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let writeAlgorithm = () => promiseResolvedWith(void 0);
          let closeAlgorithm = () => promiseResolvedWith(void 0);
          let abortAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSink.start !== void 0) {
            startAlgorithm = () => underlyingSink.start(controller);
          }
          if (underlyingSink.write !== void 0) {
            writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
          }
          if (underlyingSink.close !== void 0) {
            closeAlgorithm = () => underlyingSink.close();
          }
          if (underlyingSink.abort !== void 0) {
            abortAlgorithm = (reason) => underlyingSink.abort(reason);
          }
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function WritableStreamDefaultControllerClearAlgorithms(controller) {
          controller._writeAlgorithm = void 0;
          controller._closeAlgorithm = void 0;
          controller._abortAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function WritableStreamDefaultControllerClose(controller) {
          EnqueueValueWithSize(controller, closeSentinel, 0);
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
          try {
            return controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
          }
        }
        function WritableStreamDefaultControllerGetDesiredSize(controller) {
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
          }
          const stream = controller._controlledWritableStream;
          if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
          const stream = controller._controlledWritableStream;
          if (!controller._started) {
            return;
          }
          if (stream._inFlightWriteRequest !== void 0) {
            return;
          }
          const state = stream._state;
          if (state === "erroring") {
            WritableStreamFinishErroring(stream);
            return;
          }
          if (controller._queue.length === 0) {
            return;
          }
          const value = PeekQueueValue(controller);
          if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
          } else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
          }
        }
        function WritableStreamDefaultControllerErrorIfNeeded(controller, error2) {
          if (controller._controlledWritableStream._state === "writable") {
            WritableStreamDefaultControllerError(controller, error2);
          }
        }
        function WritableStreamDefaultControllerProcessClose(controller) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkCloseRequestInFlight(stream);
          DequeueValue(controller);
          const sinkClosePromise = controller._closeAlgorithm();
          WritableStreamDefaultControllerClearAlgorithms(controller);
          uponPromise(sinkClosePromise, () => {
            WritableStreamFinishInFlightClose(stream);
          }, (reason) => {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkFirstWriteRequestInFlight(stream);
          const sinkWritePromise = controller._writeAlgorithm(chunk);
          uponPromise(sinkWritePromise, () => {
            WritableStreamFinishInFlightWrite(stream);
            const state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (reason) => {
            if (stream._state === "writable") {
              WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerGetBackpressure(controller) {
          const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
          return desiredSize <= 0;
        }
        function WritableStreamDefaultControllerError(controller, error2) {
          const stream = controller._controlledWritableStream;
          WritableStreamDefaultControllerClearAlgorithms(controller);
          WritableStreamStartErroring(stream, error2);
        }
        function streamBrandCheckException$2(name) {
          return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
        }
        function defaultControllerBrandCheckException$2(name) {
          return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
        }
        function defaultWriterBrandCheckException(name) {
          return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
        }
        function defaultWriterLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released writer");
        }
        function defaultWriterClosedPromiseInitialize(writer) {
          writer._closedPromise = newPromise((resolve2, reject) => {
            writer._closedPromise_resolve = resolve2;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = "pending";
          });
        }
        function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseReject(writer, reason);
        }
        function defaultWriterClosedPromiseInitializeAsResolved(writer) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseResolve(writer);
        }
        function defaultWriterClosedPromiseReject(writer, reason) {
          if (writer._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._closedPromise);
          writer._closedPromise_reject(reason);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "rejected";
        }
        function defaultWriterClosedPromiseResetToRejected(writer, reason) {
          defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterClosedPromiseResolve(writer) {
          if (writer._closedPromise_resolve === void 0) {
            return;
          }
          writer._closedPromise_resolve(void 0);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "resolved";
        }
        function defaultWriterReadyPromiseInitialize(writer) {
          writer._readyPromise = newPromise((resolve2, reject) => {
            writer._readyPromise_resolve = resolve2;
            writer._readyPromise_reject = reject;
          });
          writer._readyPromiseState = "pending";
        }
        function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseReject(writer, reason);
        }
        function defaultWriterReadyPromiseInitializeAsResolved(writer) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseResolve(writer);
        }
        function defaultWriterReadyPromiseReject(writer, reason) {
          if (writer._readyPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._readyPromise);
          writer._readyPromise_reject(reason);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "rejected";
        }
        function defaultWriterReadyPromiseReset(writer) {
          defaultWriterReadyPromiseInitialize(writer);
        }
        function defaultWriterReadyPromiseResetToRejected(writer, reason) {
          defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterReadyPromiseResolve(writer) {
          if (writer._readyPromise_resolve === void 0) {
            return;
          }
          writer._readyPromise_resolve(void 0);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "fulfilled";
        }
        const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
        function isDOMExceptionConstructor(ctor) {
          if (!(typeof ctor === "function" || typeof ctor === "object")) {
            return false;
          }
          try {
            new ctor();
            return true;
          } catch (_a) {
            return false;
          }
        }
        function createDOMExceptionPolyfill() {
          const ctor = function DOMException2(message, name) {
            this.message = message || "";
            this.name = name || "Error";
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          };
          ctor.prototype = Object.create(Error.prototype);
          Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
          return ctor;
        }
        const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
        function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
          const reader = AcquireReadableStreamDefaultReader(source);
          const writer = AcquireWritableStreamDefaultWriter(dest);
          source._disturbed = true;
          let shuttingDown = false;
          let currentWrite = promiseResolvedWith(void 0);
          return newPromise((resolve2, reject) => {
            let abortAlgorithm;
            if (signal !== void 0) {
              abortAlgorithm = () => {
                const error2 = new DOMException$1("Aborted", "AbortError");
                const actions = [];
                if (!preventAbort) {
                  actions.push(() => {
                    if (dest._state === "writable") {
                      return WritableStreamAbort(dest, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                if (!preventCancel) {
                  actions.push(() => {
                    if (source._state === "readable") {
                      return ReadableStreamCancel(source, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error2);
              };
              if (signal.aborted) {
                abortAlgorithm();
                return;
              }
              signal.addEventListener("abort", abortAlgorithm);
            }
            function pipeLoop() {
              return newPromise((resolveLoop, rejectLoop) => {
                function next(done) {
                  if (done) {
                    resolveLoop();
                  } else {
                    PerformPromiseThen(pipeStep(), next, rejectLoop);
                  }
                }
                next(false);
              });
            }
            function pipeStep() {
              if (shuttingDown) {
                return promiseResolvedWith(true);
              }
              return PerformPromiseThen(writer._readyPromise, () => {
                return newPromise((resolveRead, rejectRead) => {
                  ReadableStreamDefaultReaderRead(reader, {
                    _chunkSteps: (chunk) => {
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop4);
                      resolveRead(false);
                    },
                    _closeSteps: () => resolveRead(true),
                    _errorSteps: rejectRead
                  });
                });
              });
            }
            isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
              if (!preventAbort) {
                shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesClosed(source, reader._closedPromise, () => {
              if (!preventClose) {
                shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
              } else {
                shutdown();
              }
            });
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
              const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
              } else {
                shutdown(true, destClosed);
              }
            }
            setPromiseIsHandledToTrue(pipeLoop());
            function waitForWritesToFinish() {
              const oldCurrentWrite = currentWrite;
              return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
            }
            function isOrBecomesErrored(stream, promise, action) {
              if (stream._state === "errored") {
                action(stream._storedError);
              } else {
                uponRejection(promise, action);
              }
            }
            function isOrBecomesClosed(stream, promise, action) {
              if (stream._state === "closed") {
                action();
              } else {
                uponFulfillment(promise, action);
              }
            }
            function shutdownWithAction(action, originalIsError, originalError) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), doTheRest);
              } else {
                doTheRest();
              }
              function doTheRest() {
                uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              }
            }
            function shutdown(isError, error2) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error2));
              } else {
                finalize(isError, error2);
              }
            }
            function finalize(isError, error2) {
              WritableStreamDefaultWriterRelease(writer);
              ReadableStreamReaderGenericRelease(reader);
              if (signal !== void 0) {
                signal.removeEventListener("abort", abortAlgorithm);
              }
              if (isError) {
                reject(error2);
              } else {
                resolve2(void 0);
              }
            }
          });
        }
        class ReadableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("desiredSize");
            }
            return ReadableStreamDefaultControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("close");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits close");
            }
            ReadableStreamDefaultControllerClose(this);
          }
          enqueue(chunk = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("enqueue");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits enqueue");
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
              const chunk = DequeueValue(this);
              if (this._closeRequested && this._queue.length === 0) {
                ReadableStreamDefaultControllerClearAlgorithms(this);
                ReadableStreamClose(stream);
              } else {
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
              readRequest._chunkSteps(chunk);
            } else {
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
          }
        }
        Object.defineProperties(ReadableStreamDefaultController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultController",
            configurable: true
          });
        }
        function IsReadableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultController;
        }
        function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableStreamDefaultControllerError(controller, e2);
          });
        }
        function ReadableStreamDefaultControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableStream;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableStreamDefaultControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function ReadableStreamDefaultControllerClose(controller) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          controller._closeRequested = true;
          if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
        }
        function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
          } else {
            let chunkSize;
            try {
              chunkSize = controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              ReadableStreamDefaultControllerError(controller, chunkSizeE);
              throw chunkSizeE;
            }
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              ReadableStreamDefaultControllerError(controller, enqueueE);
              throw enqueueE;
            }
          }
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }
        function ReadableStreamDefaultControllerError(controller, e2) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableStreamDefaultControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableStreamDefaultControllerHasBackpressure(controller) {
          if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
          }
          return true;
        }
        function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
          const state = controller._controlledReadableStream._state;
          if (!controller._closeRequested && state === "readable") {
            return true;
          }
          return false;
        }
        function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledReadableStream = stream;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._started = false;
          controller._closeRequested = false;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableStreamDefaultControllerError(controller, r2);
          });
        }
        function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSource.start !== void 0) {
            startAlgorithm = () => underlyingSource.start(controller);
          }
          if (underlyingSource.pull !== void 0) {
            pullAlgorithm = () => underlyingSource.pull(controller);
          }
          if (underlyingSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
          }
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function defaultControllerBrandCheckException$1(name) {
          return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
        }
        function ReadableStreamTee(stream, cloneForBranch2) {
          if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
          }
          return ReadableStreamDefaultTee(stream);
        }
        function ReadableStreamDefaultTee(stream, cloneForBranch2) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgain = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function pullAlgorithm() {
            if (reading) {
              readAgain = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgain = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgain) {
                    pullAlgorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
          }
          branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
          branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
          uponRejection(reader._closedPromise, (r2) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgainForBranch1 = false;
          let readAgainForBranch2 = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, (r2) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r2);
              ReadableByteStreamControllerError(branch2._readableStreamController, r2);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
          }
          function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamDefaultReader(stream);
              forwardReaderError(reader);
            }
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const chunk1 = chunk;
                  let chunk2 = chunk;
                  if (!canceled1 && !canceled2) {
                    try {
                      chunk2 = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                  }
                  if (!canceled1) {
                    ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableByteStreamControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerClose(branch2._readableStreamController);
                }
                if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                }
                if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
          }
          function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamBYOBReader(stream);
              forwardReaderError(reader);
            }
            const byobBranch = forBranch2 ? branch2 : branch1;
            const otherBranch = forBranch2 ? branch1 : branch2;
            const readIntoRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!otherCanceled) {
                    let clonedChunk;
                    try {
                      clonedChunk = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                  } else if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: (chunk) => {
                reading = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!byobCanceled) {
                  ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                }
                if (!otherCanceled) {
                  ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                }
                if (chunk !== void 0) {
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                  }
                }
                if (!byobCanceled || !otherCanceled) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
          }
          function pull1Algorithm() {
            if (reading) {
              readAgainForBranch1 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(void 0);
          }
          function pull2Algorithm() {
            if (reading) {
              readAgainForBranch2 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
            return;
          }
          branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
          branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
          forwardReaderError(reader);
          return [branch1, branch2];
        }
        function convertUnderlyingDefaultOrByteSource(source, context) {
          assertDictionary(source, context);
          const original = source;
          const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
          const cancel = original === null || original === void 0 ? void 0 : original.cancel;
          const pull = original === null || original === void 0 ? void 0 : original.pull;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          return {
            autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
            cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
            pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
            type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
          };
        }
        function convertUnderlyingSourceCancelCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSourcePullCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertUnderlyingSourceStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertReadableStreamType(type, context) {
          type = `${type}`;
          if (type !== "bytes") {
            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
          }
          return type;
        }
        function convertReaderOptions(options, context) {
          assertDictionary(options, context);
          const mode = options === null || options === void 0 ? void 0 : options.mode;
          return {
            mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
          };
        }
        function convertReadableStreamReaderMode(mode, context) {
          mode = `${mode}`;
          if (mode !== "byob") {
            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
          }
          return mode;
        }
        function convertIteratorOptions(options, context) {
          assertDictionary(options, context);
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options, context) {
          assertDictionary(options, context);
          const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
          const signal = options === null || options === void 0 ? void 0 : options.signal;
          if (signal !== void 0) {
            assertAbortSignal(signal, `${context} has member 'signal' that`);
          }
          return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal
          };
        }
        function assertAbortSignal(signal, context) {
          if (!isAbortSignal2(signal)) {
            throw new TypeError(`${context} is not an AbortSignal.`);
          }
        }
        function convertReadableWritablePair(pair, context) {
          assertDictionary(pair, context);
          const readable2 = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable2, "readable", "ReadableWritablePair");
          assertReadableStream(readable2, `${context} has member 'readable' that`);
          const writable2 = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable2, "writable", "ReadableWritablePair");
          assertWritableStream(writable2, `${context} has member 'writable' that`);
          return { readable: readable2, writable: writable2 };
        }
        class ReadableStream2 {
          constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
            if (rawUnderlyingSource === void 0) {
              rawUnderlyingSource = null;
            } else {
              assertObject(rawUnderlyingSource, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
            InitializeReadableStream(this);
            if (underlyingSource.type === "bytes") {
              if (strategy.size !== void 0) {
                throw new RangeError("The strategy for a byte stream cannot have a size function");
              }
              const highWaterMark = ExtractHighWaterMark(strategy, 0);
              SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            } else {
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
          }
          get locked() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("locked");
            }
            return IsReadableStreamLocked(this);
          }
          cancel(reason = void 0) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("cancel"));
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
            }
            return ReadableStreamCancel(this, reason);
          }
          getReader(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("getReader");
            }
            const options = convertReaderOptions(rawOptions, "First parameter");
            if (options.mode === void 0) {
              return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
          }
          pipeThrough(rawTransform, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("pipeThrough");
            }
            assertRequiredArgument(rawTransform, 1, "pipeThrough");
            const transform = convertReadableWritablePair(rawTransform, "First parameter");
            const options = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
          }
          pipeTo(destination, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
            }
            if (destination === void 0) {
              return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
            }
            if (!IsWritableStream(destination)) {
              return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
            }
            let options;
            try {
              options = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e2) {
              return promiseRejectedWith(e2);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          }
          tee() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("tee");
            }
            const branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
          }
          values(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("values");
            }
            const options = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
          }
        }
        Object.defineProperties(ReadableStream2.prototype, {
          cancel: { enumerable: true },
          getReader: { enumerable: true },
          pipeThrough: { enumerable: true },
          pipeTo: { enumerable: true },
          tee: { enumerable: true },
          values: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStream",
            configurable: true
          });
        }
        if (typeof SymbolPolyfill.asyncIterator === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream2.prototype.values,
            writable: true,
            configurable: true
          });
        }
        function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableByteStreamController.prototype);
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
          return stream;
        }
        function InitializeReadableStream(stream) {
          stream._state = "readable";
          stream._reader = void 0;
          stream._storedError = void 0;
          stream._disturbed = false;
        }
        function IsReadableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStream2;
        }
        function IsReadableStreamLocked(stream) {
          if (stream._reader === void 0) {
            return false;
          }
          return true;
        }
        function ReadableStreamCancel(stream, reason) {
          stream._disturbed = true;
          if (stream._state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (stream._state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          ReadableStreamClose(stream);
          const reader = stream._reader;
          if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._closeSteps(void 0);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
          const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
          return transformPromiseWith(sourceCancelPromise, noop4);
        }
        function ReadableStreamClose(stream) {
          stream._state = "closed";
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseResolve(reader);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
          }
        }
        function ReadableStreamError(stream, e2) {
          stream._state = "errored";
          stream._storedError = e2;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e2);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e2);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e2);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
        }
        function streamBrandCheckException$1(name) {
          return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
        }
        function convertQueuingStrategyInit(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
          return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
          };
        }
        const byteLengthSizeFunction = (chunk) => {
          return chunk.byteLength;
        };
        try {
          Object.defineProperty(byteLengthSizeFunction, "name", {
            value: "size",
            configurable: true
          });
        } catch (_a) {
        }
        class ByteLengthQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("highWaterMark");
            }
            return this._byteLengthQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("size");
            }
            return byteLengthSizeFunction;
          }
        }
        Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "ByteLengthQueuingStrategy",
            configurable: true
          });
        }
        function byteLengthBrandCheckException(name) {
          return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
        }
        function IsByteLengthQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        try {
          Object.defineProperty(countSizeFunction, "name", {
            value: "size",
            configurable: true
          });
        } catch (_a) {
        }
        class CountQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "CountQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._countQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("highWaterMark");
            }
            return this._countQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("size");
            }
            return countSizeFunction;
          }
        }
        Object.defineProperties(CountQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "CountQueuingStrategy",
            configurable: true
          });
        }
        function countBrandCheckException(name) {
          return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
        }
        function IsCountQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof CountQueuingStrategy;
        }
        function convertTransformer(original, context) {
          assertDictionary(original, context);
          const flush = original === null || original === void 0 ? void 0 : original.flush;
          const readableType = original === null || original === void 0 ? void 0 : original.readableType;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const transform = original === null || original === void 0 ? void 0 : original.transform;
          const writableType = original === null || original === void 0 ? void 0 : original.writableType;
          return {
            flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
            readableType,
            start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
            transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
            writableType
          };
        }
        function convertTransformerFlushCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertTransformerStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertTransformerTransformCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        class TransformStream {
          constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
            if (rawTransformer === void 0) {
              rawTransformer = null;
            }
            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
            const transformer = convertTransformer(rawTransformer, "First parameter");
            if (transformer.readableType !== void 0) {
              throw new RangeError("Invalid readableType specified");
            }
            if (transformer.writableType !== void 0) {
              throw new RangeError("Invalid writableType specified");
            }
            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            let startPromise_resolve;
            const startPromise = newPromise((resolve2) => {
              startPromise_resolve = resolve2;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
            if (transformer.start !== void 0) {
              startPromise_resolve(transformer.start(this._transformStreamController));
            } else {
              startPromise_resolve(void 0);
            }
          }
          get readable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("readable");
            }
            return this._readable;
          }
          get writable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("writable");
            }
            return this._writable;
          }
        }
        Object.defineProperties(TransformStream.prototype, {
          readable: { enumerable: true },
          writable: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStream",
            configurable: true
          });
        }
        function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
          function startAlgorithm() {
            return startPromise;
          }
          function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
          }
          function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
          }
          function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
          }
          stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
          function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
          }
          function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(void 0);
          }
          stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          stream._backpressure = void 0;
          stream._backpressureChangePromise = void 0;
          stream._backpressureChangePromise_resolve = void 0;
          TransformStreamSetBackpressure(stream, true);
          stream._transformStreamController = void 0;
        }
        function IsTransformStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
            return false;
          }
          return x2 instanceof TransformStream;
        }
        function TransformStreamError(stream, e2) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
          if (stream._backpressure) {
            TransformStreamSetBackpressure(stream, false);
          }
        }
        function TransformStreamSetBackpressure(stream, backpressure) {
          if (stream._backpressureChangePromise !== void 0) {
            stream._backpressureChangePromise_resolve();
          }
          stream._backpressureChangePromise = newPromise((resolve2) => {
            stream._backpressureChangePromise_resolve = resolve2;
          });
          stream._backpressure = backpressure;
        }
        class TransformStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("desiredSize");
            }
            const readableController = this._controlledTransformStream._readable._readableStreamController;
            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
          }
          enqueue(chunk = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("enqueue");
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
          }
          error(reason = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("error");
            }
            TransformStreamDefaultControllerError(this, reason);
          }
          terminate() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("terminate");
            }
            TransformStreamDefaultControllerTerminate(this);
          }
        }
        Object.defineProperties(TransformStreamDefaultController.prototype, {
          enqueue: { enumerable: true },
          error: { enumerable: true },
          terminate: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStreamDefaultController",
            configurable: true
          });
        }
        function IsTransformStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
            return false;
          }
          return x2 instanceof TransformStreamDefaultController;
        }
        function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
          controller._controlledTransformStream = stream;
          stream._transformStreamController = controller;
          controller._transformAlgorithm = transformAlgorithm;
          controller._flushAlgorithm = flushAlgorithm;
        }
        function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
          const controller = Object.create(TransformStreamDefaultController.prototype);
          let transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
          let flushAlgorithm = () => promiseResolvedWith(void 0);
          if (transformer.transform !== void 0) {
            transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
          }
          if (transformer.flush !== void 0) {
            flushAlgorithm = () => transformer.flush(controller);
          }
          SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
        }
        function TransformStreamDefaultControllerClearAlgorithms(controller) {
          controller._transformAlgorithm = void 0;
          controller._flushAlgorithm = void 0;
        }
        function TransformStreamDefaultControllerEnqueue(controller, chunk) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError("Readable side is not in a state that permits enqueue");
          }
          try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
          } catch (e2) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e2);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e2) {
          TransformStreamError(controller._controlledTransformStream, e2);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r2) => {
            TransformStreamError(controller._controlledTransformStream, r2);
            throw r2;
          });
        }
        function TransformStreamDefaultControllerTerminate(controller) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          ReadableStreamDefaultControllerClose(readableController);
          const error2 = new TypeError("TransformStream terminated");
          TransformStreamErrorWritableAndUnblockWrite(stream, error2);
        }
        function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
          const controller = stream._transformStreamController;
          if (stream._backpressure) {
            const backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, () => {
              const writable2 = stream._writable;
              const state = writable2._state;
              if (state === "erroring") {
                throw writable2._storedError;
              }
              return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
          }
          return TransformStreamDefaultControllerPerformTransform(controller, chunk);
        }
        function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
          TransformStreamError(stream, reason);
          return promiseResolvedWith(void 0);
        }
        function TransformStreamDefaultSinkCloseAlgorithm(stream) {
          const readable2 = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable2._state === "errored") {
              throw readable2._storedError;
            }
            ReadableStreamDefaultControllerClose(readable2._readableStreamController);
          }, (r2) => {
            TransformStreamError(stream, r2);
            throw readable2._storedError;
          });
        }
        function TransformStreamDefaultSourcePullAlgorithm(stream) {
          TransformStreamSetBackpressure(stream, false);
          return stream._backpressureChangePromise;
        }
        function defaultControllerBrandCheckException(name) {
          return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
        }
        function streamBrandCheckException(name) {
          return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
        }
        exports2.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
        exports2.CountQueuingStrategy = CountQueuingStrategy;
        exports2.ReadableByteStreamController = ReadableByteStreamController;
        exports2.ReadableStream = ReadableStream2;
        exports2.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
        exports2.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
        exports2.ReadableStreamDefaultController = ReadableStreamDefaultController;
        exports2.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
        exports2.TransformStream = TransformStream;
        exports2.TransformStreamDefaultController = TransformStreamDefaultController;
        exports2.WritableStream = WritableStream;
        exports2.WritableStreamDefaultController = WritableStreamDefaultController;
        exports2.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    })(ponyfill_es2018, ponyfill_es2018.exports);
    POOL_SIZE$1 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("node:process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("node:stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error2) {
          process2.emitWarning = emitWarning;
          throw error2;
        }
      } catch (error2) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob3 } = require("buffer");
      if (Blob3 && !Blob3.prototype.stream) {
        Blob3.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error2) {
    }
    POOL_SIZE = 65536;
    _Blob = class Blob {
      #parts = [];
      #type = "";
      #size = 0;
      #endings = "transparent";
      constructor(blobParts = [], options = {}) {
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null)
          options = {};
        const encoder2 = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob) {
            part = element;
          } else {
            part = encoder2.encode(`${element}`);
          }
          const size = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (size) {
            this.#size += size;
            this.#parts.push(part);
          }
        }
        this.#endings = `${options.endings === void 0 ? "transparent" : options.endings}`;
        const type = options.type === void 0 ? "" : String(options.type);
        this.#type = /^[\x20-\x7E]*$/.test(type) ? type : "";
      }
      get size() {
        return this.#size;
      }
      get type() {
        return this.#type;
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(this.#parts, true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        blob.#size = span;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob2 = _Blob;
    Blob$1 = Blob2;
    _File = class File2 extends Blob$1 {
      #lastModified = 0;
      #name = "";
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        if (options === null)
          options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          this.#lastModified = lastModified;
        }
        this.#name = String(fileName);
      }
      get name() {
        return this.#name;
      }
      get lastModified() {
        return this.#lastModified;
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
      static [Symbol.hasInstance](object) {
        return !!object && object instanceof Blob$1 && /^(File)$/.test(object[Symbol.toStringTag]);
      }
    };
    File = _File;
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f2 = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new File([b], c, b) : b] : [a, b + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData = class FormData2 {
      #d = [];
      constructor(...a) {
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        this.#d.push(f2(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        this.#d = this.#d.filter(([b]) => b !== a);
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = this.#d, l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        this.#d.forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return this.#d.some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f2(...a);
        this.#d.forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        this.#d = b;
      }
      *entries() {
        yield* this.#d;
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    };
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    isBlob = (object) => {
      return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
    isDomainOrSubdomain = (destination, original) => {
      const orig = new URL(original).hostname;
      const dest = new URL(destination).hostname;
      return orig === dest || orig.endsWith(`.${dest}`);
    };
    pipeline = (0, import_node_util.promisify)(import_node_stream.default.pipeline);
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = import_node_buffer.Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (import_node_buffer.Buffer.isBuffer(body))
          ;
        else if (import_node_util.types.isAnyArrayBuffer(body)) {
          body = import_node_buffer.Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = import_node_buffer.Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_node_stream.default)
          ;
        else if (body instanceof FormData) {
          body = formDataToBlob(body);
          boundary = body.type.split("=")[1];
        } else {
          body = import_node_buffer.Buffer.from(String(body));
        }
        let stream = body;
        if (import_node_buffer.Buffer.isBuffer(body)) {
          stream = import_node_stream.default.Readable.from(body);
        } else if (isBlob(body)) {
          stream = import_node_stream.default.Readable.from(body.stream());
        }
        this[INTERNALS$2] = {
          body,
          stream,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_node_stream.default) {
          body.on("error", (error_) => {
            const error2 = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].stream;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async formData() {
        const ct = this.headers.get("content-type");
        if (ct.startsWith("application/x-www-form-urlencoded")) {
          const formData = new FormData();
          const parameters = new URLSearchParams(await this.text());
          for (const [name, value] of parameters) {
            formData.append(name, value);
          }
          return formData;
        }
        const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
        return toFormData2(this.body, ct);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.arrayBuffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const text = await this.text();
        return JSON.parse(text);
      }
      async text() {
        const buffer = await consumeBody(this);
        return new TextDecoder().decode(buffer);
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Body.prototype.buffer = (0, import_node_util.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true },
      data: { get: (0, import_node_util.deprecate)(() => {
      }, "data doesn't exist, use json(), text(), arrayBuffer(), or body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (response)") }
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance[INTERNALS$2];
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_node_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_node_stream.PassThrough({ highWaterMark });
        p2 = new import_node_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].stream = p1;
        body = p2;
      }
      return body;
    };
    getNonSpecFormDataBoundary = (0, import_node_util.deprecate)((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (import_node_buffer.Buffer.isBuffer(body) || import_node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body instanceof FormData) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
      }
      if (body instanceof import_node_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request[INTERNALS$2];
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (import_node_buffer.Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      return null;
    };
    writeToStream = async (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else {
        await pipeline(body, dest);
      }
    };
    validateHeaderName = typeof import_node_http.default.validateHeaderName === "function" ? import_node_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error2 = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error2;
      }
    };
    validateHeaderValue = typeof import_node_http.default.validateHeaderValue === "function" ? import_node_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error2 = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_CHAR" });
        throw error2;
      }
    };
    Headers2 = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers2) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_node_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_node_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback, thisArg = void 0) {
        for (const name of this.keys()) {
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key2) => {
          result[key2] = this.getAll(key2);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key2) => {
          const values = this.getAll(key2);
          if (key2 === "host") {
            result[key2] = values[0];
          } else {
            result[key2] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers2.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response2 = class extends Body {
      constructor(body = null, options = {}) {
        super(body, options);
        const status = options.status != null ? options.status : 200;
        const headers = new Headers2(options.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options.url,
          status,
          statusText: options.statusText || "",
          headers,
          counter: options.counter,
          highWaterMark: options.highWaterMark
        };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response2(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size,
          highWaterMark: this.highWaterMark
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response2(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response2(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response2.prototype, {
      type: { enumerable: true },
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    ReferrerPolicy = /* @__PURE__ */ new Set([
      "",
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url"
    ]);
    DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    doBadDataWarn = (0, import_node_util.deprecate)(() => {
    }, ".data is not a valid RequestInit property, use .body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (request)");
    Request2 = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        if (parsedURL.username !== "" || parsedURL.password !== "") {
          throw new TypeError(`${parsedURL} is an url with embedded credentials.`);
        }
        let method = init2.method || input.method || "GET";
        if (/^(delete|get|head|options|post|put)$/i.test(method)) {
          method = method.toUpperCase();
        }
        if ("data" in init2) {
          doBadDataWarn();
        }
        if ((init2.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers2(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.set("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        let referrer = init2.referrer == null ? input.referrer : init2.referrer;
        if (referrer === "") {
          referrer = "no-referrer";
        } else if (referrer) {
          const parsedReferrer = new URL(referrer);
          referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
        } else {
          referrer = void 0;
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal,
          referrer
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
        this.referrerPolicy = init2.referrerPolicy || input.referrerPolicy || "";
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_node_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      get referrer() {
        if (this[INTERNALS].referrer === "no-referrer") {
          return "";
        }
        if (this[INTERNALS].referrer === "client") {
          return "about:client";
        }
        if (this[INTERNALS].referrer) {
          return this[INTERNALS].referrer.toString();
        }
        return void 0;
      }
      get referrerPolicy() {
        return this[INTERNALS].referrerPolicy;
      }
      set referrerPolicy(referrerPolicy) {
        this[INTERNALS].referrerPolicy = validateReferrerPolicy(referrerPolicy);
      }
      clone() {
        return new Request2(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request2.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true },
      referrer: { enumerable: true },
      referrerPolicy: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers2(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (request.referrerPolicy === "") {
        request.referrerPolicy = DEFAULT_REFERRER_POLICY;
      }
      if (request.referrer && request.referrer !== "no-referrer") {
        request[INTERNALS].referrer = determineRequestsReferrer(request);
      } else {
        request[INTERNALS].referrer = "no-referrer";
      }
      if (request[INTERNALS].referrer instanceof URL) {
        headers.set("Referer", request.referrer);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const options = {
        path: parsedURL.pathname + search,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return {
        parsedURL,
        options
      };
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    if (!globalThis.DOMException) {
      try {
        const { MessageChannel } = require("worker_threads"), port = new MessageChannel().port1, ab = new ArrayBuffer();
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        err.constructor.name === "DOMException" && (globalThis.DOMException = err.constructor);
      }
    }
    supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
    globals = {
      crypto: import_crypto.webcrypto,
      fetch: fetch2,
      Response: Response2,
      Request: Request2,
      Headers: Headers2
    };
  }
});

// .svelte-kit/output/server/chunks/index-829c628b.js
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
  return context;
}
function getContext(key2) {
  return get_current_component().$$.context.get(key2);
}
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function each(items, fn) {
  let str = "";
  for (let i2 = 0; i2 < items.length; i2 += 1) {
    str += fn(items[i2], i2);
  }
  return str;
}
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css25) => css25.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  const assignment = boolean && value === true ? "" : `="${escape_attribute_value(value.toString())}"`;
  return ` ${name}${assignment}`;
}
var current_component, escaped, missing_component, on_destroy;
var init_index_829c628b = __esm({
  ".svelte-kit/output/server/chunks/index-829c628b.js"() {
    Promise.resolve();
    escaped = {
      '"': "&quot;",
      "'": "&#39;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    };
    missing_component = {
      $$render: () => ""
    };
  }
});

// .svelte-kit/output/server/chunks/hooks-1c45ba0b.js
var hooks_1c45ba0b_exports = {};
var init_hooks_1c45ba0b = __esm({
  ".svelte-kit/output/server/chunks/hooks-1c45ba0b.js"() {
  }
});

// .svelte-kit/output/server/entries/pages/__layout.svelte.js
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: () => _layout
});
var getStores, page, Logo, _layout;
var init_layout_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/__layout.svelte.js"() {
    init_index_829c628b();
    getStores = () => {
      const stores = getContext("__svelte__");
      return {
        page: {
          subscribe: stores.page.subscribe
        },
        navigating: {
          subscribe: stores.navigating.subscribe
        },
        get preloading() {
          console.error("stores.preloading is deprecated; use stores.navigating instead");
          return {
            subscribe: stores.navigating.subscribe
          };
        },
        session: stores.session,
        updated: stores.updated
      };
    };
    page = {
      subscribe(fn) {
        const store = getStores().page;
        return store.subscribe(fn);
      }
    };
    Logo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `<a href="${"/"}"><div class="${"grid w-12 large:w-20 large:h-20 large:text-4xl h-12 text-2xl font-bold rounded-tl-lg rounded-tr-sm rounded-bl-sm rounded-br-lg place-items-center bg-gradient-to-br from-blue-500 to-green-400"}">m
  </div></a>`;
    });
    _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      let year = new Date().getFullYear();
      $$unsubscribe_page();
      return `${$page.url.pathname === "/links" ? `${slots.default ? slots.default({}) : ``}` : `<header class="${"flex items-center justify-between px-4 py-6 md:px-12 2xl:px-56 large:pb-16"}">${validate_component(Logo, "Logo").$$render($$result, {}, {}, {})}
    <nav class="${"relative group"}"><button class="${"menu"}" aria-label="${"menu button"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" class="${"w-6 h-6 large:w-12 large:h-12"}" fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}" stroke-width="${"2"}"><path d="${"M4 8h16"}" class="${"rotate-0 translate-x-0 translate-y-0 group-hover:rotate-[-45deg] group-hover:translate-y-[18px] group-hover:translate-x-[-2px]"}"></path><path d="${"M4 14h16"}" class="${"rotate-0 translate-x-0 translate-y-0 group-hover:rotate-[45deg] group-hover:translate-y-[-3px] group-hover:translate-x-[14px]"}"></path></svg></button>
      <ul class="${"absolute z-10 flex-col hidden w-40 px-4 py-6 shadow-xl bg-slate-50 rounded-2xl right-3 group-hover:flex"}">${each(["", "About", "Projects", "Blog"], (route) => {
        return `<li class="${[
          "p-1 rounded-md",
          route.toLowerCase() === $page.url.pathname.slice(1) ? "active" : ""
        ].join(" ").trim()}"><a${add_attribute("href", route === "" ? "/" : `/${route.toLowerCase()}`, 0)} class="${"py-1 pr-16"}">${escape(route === "" ? "Home" : route)}</a>
          </li>`;
      })}
        <li class="${"flex items-center justify-start pl-1 mt-4"}"><a href="${"https://github.com/mac-h95"}" class="${"mr-3"}" aria-label="${"GitHub"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" class="${""}" viewBox="${"0 0 16 16"}" width="${"16"}" height="${"16"}"><path fill-rule="${"evenodd"}" d="${"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"}"></path></svg></a>
          <a href="${"mailto:mac.develops@icloud.com"}" class="${"mr-3"}" aria-label="${"email"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" class="${"w-5 h-5"}" viewBox="${"0 0 20 20"}" fill="${"currentColor"}"><path d="${"M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"}"></path><path d="${"M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"}"></path></svg></a></li></ul></nav></header>

  <main class="${"min-h-screen"}">${slots.default ? slots.default({}) : ``}</main>

  <footer class="${"flex items-center justify-between px-4 py-6 md:p-12 bg-primary-800 text-zinc-50"}"><div class="${"text-sm"}">${validate_component(Logo, "Logo").$$render($$result, {}, {}, {})}
      <p class="${"mt-2"}">Blazing fast websites.</p>
      <p>Copyright \xA9 ${escape(year)}</p>
      <div class="${"flex items-center mt-2 space-x-4"}"><a href="${"https://github.com/mac-h95"}" aria-label="${"GitHub"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" class="${""}" viewBox="${"0 0 16 16"}" width="${"16"}" height="${"16"}" fill="${"currentColor"}"><path fill-rule="${"evenodd"}" d="${"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"}"></path></svg></a>
        <a href="${"mailto:mac.develops@icloud.com"}" aria-label="${"email"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" class="${"w-5 h-5"}" viewBox="${"0 0 20 20"}" fill="${"currentColor"}"><path d="${"M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"}"></path><path d="${"M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"}"></path></svg></a></div></div></footer>`}`;
    });
  }
});

// .svelte-kit/output/server/nodes/0.js
var __exports = {};
__export(__exports, {
  css: () => css,
  entry: () => entry,
  index: () => index,
  js: () => js,
  module: () => layout_svelte_exports
});
var index, entry, js, css;
var init__ = __esm({
  ".svelte-kit/output/server/nodes/0.js"() {
    init_layout_svelte();
    index = 0;
    entry = "pages/__layout.svelte-d386a9ef.js";
    js = ["pages/__layout.svelte-d386a9ef.js", "chunks/index-db76da04.js"];
    css = ["assets/pages/__layout.svelte-8de9f428.css"];
  }
});

// .svelte-kit/output/server/entries/fallbacks/error.svelte.js
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: () => Error2,
  load: () => load
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error2;
var init_error_svelte = __esm({
  ".svelte-kit/output/server/entries/fallbacks/error.svelte.js"() {
    init_index_829c628b();
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { status } = $$props;
      let { error: error2 } = $$props;
      if ($$props.status === void 0 && $$bindings.status && status !== void 0)
        $$bindings.status(status);
      if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
        $$bindings.error(error2);
      return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/1.js
var __exports2 = {};
__export(__exports2, {
  css: () => css2,
  entry: () => entry2,
  index: () => index2,
  js: () => js2,
  module: () => error_svelte_exports
});
var index2, entry2, js2, css2;
var init__2 = __esm({
  ".svelte-kit/output/server/nodes/1.js"() {
    init_error_svelte();
    index2 = 1;
    entry2 = "error.svelte-3a7ef9e1.js";
    js2 = ["error.svelte-3a7ef9e1.js", "chunks/index-db76da04.js"];
    css2 = [];
  }
});

// .svelte-kit/output/server/chunks/project-list-33529d05.js
var Project_card, Project_list;
var init_project_list_33529d05 = __esm({
  ".svelte-kit/output/server/chunks/project-list-33529d05.js"() {
    init_index_829c628b();
    Project_card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { path, image, title, technologies, snippet } = $$props;
      if ($$props.path === void 0 && $$bindings.path && path !== void 0)
        $$bindings.path(path);
      if ($$props.image === void 0 && $$bindings.image && image !== void 0)
        $$bindings.image(image);
      if ($$props.title === void 0 && $$bindings.title && title !== void 0)
        $$bindings.title(title);
      if ($$props.technologies === void 0 && $$bindings.technologies && technologies !== void 0)
        $$bindings.technologies(technologies);
      if ($$props.snippet === void 0 && $$bindings.snippet && snippet !== void 0)
        $$bindings.snippet(snippet);
      return `<a${add_attribute("href", path, 0)} class="${"self-center snap-center flex-shrink-0 w-64 h-full mr-4 shadow-xl rounded-2xl md:mt-8 bg-slate-200 md:hover:scale-105 "}"><img${add_attribute("src", image, 0)}${add_attribute("alt", title, 0)} class="${"w-full h-36 bg-red-100 rounded-tl-2xl rounded-tr-2xl"}">
  <div class="${"flex flex-col items-start p-4 space-y-2"}"><h2 class="${"text-2xl"}">${escape(title)}</h2>
    <ul class="${"flex items-center space-x-2"}">${each(technologies, (tech) => {
        return `<li class="${"inline-block"}"><img${add_attribute("src", tech === "tw" ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg` : `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech}/${tech}-original.svg`, 0)}${add_attribute("alt", title, 0)} class="${"w-5 h-5"}">
        </li>`;
      })}</ul>
    <p class="${"my-3 line-clamp-3"}">${escape(snippet)}</p>
    <button class="${"link"}">View more</button></div></a>`;
    });
    Project_list = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { projects } = $$props;
      if ($$props.projects === void 0 && $$bindings.projects && projects !== void 0)
        $$bindings.projects(projects);
      return `<div class="${"flex snap-x snap-mandatory flex-col md:items-center"}"><div class="${"flex w-screen py-8 overflow-x-auto md:py-24 md:flex-wrap justify-center slider max-w-96"}">${projects.length < 1 ? `<div class="${"prose flex flex-col items-center"}"><h2>There&#39;s nothing here yet.</h2>
        <p>Keep your eyes on this space.</p></div>` : ``}
    ${each(projects, (project) => {
        return `${validate_component(Project_card, "ProjectCard").$$render($$result, Object.assign(project.meta, { path: project.path }), {}, {})}`;
      })}</div></div>`;
    });
  }
});

// .svelte-kit/output/server/entries/pages/index.svelte.js
var index_svelte_exports = {};
__export(index_svelte_exports, {
  default: () => Routes,
  load: () => load2
});
var Hero_image, Hero, load2, Routes;
var init_index_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/index.svelte.js"() {
    init_index_829c628b();
    init_project_list_33529d05();
    Hero_image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `<svg xmlns="${"http://www.w3.org/2000/svg"}" data-name="${"Layer 1"}" width="${"731.66157"}" height="${"436.37988"}" viewBox="${"0 0 731.66157 436.37988"}" xmlns:xlink="${"http://www.w3.org/1999/xlink"}"><path d="${"M277.2809,566.58242c-21.53541-7.834-40.22952-26.57443-42.601-49.36718a105.58313,105.58313,0,0,0,70.66119,16.17963c9.53107-1.23581,20.00324-3.60273,28.15931,1.48136,5.075,3.16333,8.22562,8.77995,9.671,14.58259,1.44526,5.803,1.38007,11.86072,1.30629,17.84051l.67057,1.33378C322.65213,573,298.8163,574.41643,277.2809,566.58242Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#f0f0f0"}"></path><path d="${"M235.14711,517.10146a90.24506,90.24506,0,0,0,44.49883,33.20826,38.86249,38.86249,0,0,0,11.95991,2.28592,22.28943,22.28943,0,0,0,11.31506-3.09551c3.23384-1.82264,6.33065-4.0615,9.95123-5.0663a13.64789,13.64789,0,0,1,11.00924,1.83764c4.06056,2.5494,6.96292,6.40578,9.67013,10.27564,3.00584,4.29674,6.05989,8.80733,10.7521,11.41587.56853.31606.04486,1.17974-.5228.86416-8.16364-4.53841-11.18634-14.1646-18.13507-20.01674-3.24241-2.73071-7.32739-4.50084-11.61242-3.61857-3.74707.77151-6.9425,3.07751-10.20088,4.95127a23.78447,23.78447,0,0,1-10.95093,3.439,35.92747,35.92747,0,0,1-12.00366-1.81766,87.554,87.554,0,0,1-24.50757-12.17349,91.8454,91.8454,0,0,1-22.11075-22.00715c-.37494-.5289.51509-1.00775.88758-.4823Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M273.74879,548.68008a13.53965,13.53965,0,0,1-16.12633,6.87949c-.62-.1948-.34638-1.16733.2744-.97227a12.53742,12.53742,0,0,0,14.98777-6.43c.2877-.58275,1.15021-.05661.86416.52281Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M301.40294,550.64024a26.09656,26.09656,0,0,0-12.0484-14.71516c-.56739-.31806-.04391-1.18184.5228-.86416a27.14437,27.14437,0,0,1,12.50633,15.33795c.19878.62009-.783.8581-.98073.24137Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M248.94086,532.87a7.66414,7.66414,0,0,0,1.26221-7.162c-.20655-.61726.77552-.85462.98072-.24137a8.58819,8.58819,0,0,1-1.37878,7.92612.522.522,0,0,1-.69348.17068.50755.50755,0,0,1-.17067-.69348Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M289.03238,461.8449c.13994.38176.27987.76352.428,1.1476a100.93226,100.93226,0,0,0,6.93983,14.82906c.20377.37034.41586.74258.62985,1.10629a106.4046,106.4046,0,0,0,25.67519,29.58826,103.33215,103.33215,0,0,0,13.0111,8.78694c6.28889,3.58315,13.39275,6.96782,17.99519,12.26338a17.72566,17.72566,0,0,1,1.35346,1.72679l-8.34165,36.41835c-.06049.07325-.11281.14881-.1734.22246l-.26657,1.4693c-.24419-.11742-.49494-.24445-.73913-.36187-.14194-.06753-.282-.14316-.42395-.21069-.094-.04758-.188-.09559-.2756-.13315-.03136-.01573-.06263-.03185-.08572-.04568-.08758-.03757-.16494-.08176-.2442-.11742q-2.10534-1.05933-4.20311-2.15192c-.00832-.0019-.00832-.0019-.01478-.01192a151.93537,151.93537,0,0,1-29.866-19.95821c-.26932-.23676-.54706-.475-.81258-.72841a98.60161,98.60161,0,0,1-11.11754-11.63256,87.17267,87.17267,0,0,1-5.17661-7.141,72.48675,72.48675,0,0,1-9.1946-20.715c-3.90461-14.64154-3.08313-30.36886,4.32693-43.36329C288.64629,462.49986,288.83427,462.17528,289.03238,461.8449Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#f0f0f0"}"></path><path d="${"M289.47586,462.03264A90.245,90.245,0,0,0,305.012,515.339a38.86263,38.86263,0,0,0,8.173,9.02587,22.28949,22.28949,0,0,0,10.89816,4.34086c3.6794.49172,7.5.5686,10.99576,1.94617a13.64784,13.64784,0,0,1,7.68387,8.09557c1.70722,4.48029,1.70278,9.30682,1.53442,14.02661-.18694,5.24043-.46414,10.68064,1.71181,15.58844.26364.59465-.67447.969-.93771.37522-3.78578-8.53874-.4036-18.04458-2.42838-26.90081-.9448-4.13247-3.1407-8.00526-7.09324-9.8807-3.45633-1.64-7.39607-1.72265-11.12584-2.18832a23.78461,23.78461,0,0,1-10.81419-3.8474,35.92752,35.92752,0,0,1-8.4899-8.67834,87.554,87.554,0,0,1-12.23864-24.4751,91.84545,91.84545,0,0,1-4.40437-30.88367c.01906-.648,1.018-.49451.99907.14929Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M301.28462,510.48728a13.53964,13.53964,0,0,1-17.0179-4.21628c-.37772-.52878.42625-1.14058.80447-.61109a12.5374,12.5374,0,0,0,15.83821,3.88965c.58057-.29208.95247.64731.37522.93772Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M322.18476,528.70207a26.0966,26.0966,0,0,0-.76043-19.00321c-.26154-.59556.67649-.97006.93771-.37522a27.14434,27.14434,0,0,1,.7511,19.77617c-.21462.61479-1.14184.21371-.92838-.39774Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M290.99566,482.92769a7.66408,7.66408,0,0,0,5.31979-4.95847c.20672-.61721,1.13376-.21545.92838.39774a8.58822,8.58822,0,0,1-5.873,5.49844.522.522,0,0,1-.65647-.28124.50756.50756,0,0,1,.28125-.65647Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M929.09776,565.83015c20.40916-10.42169,36.658-31.31785,36.2098-54.22926A105.583,105.583,0,0,1,897.171,536.34337c-9.6107-.05489-20.29439-1.11664-27.76369,4.93142-4.64765,3.76315-7.084,9.72445-7.80516,15.66075-.721,5.9366.08829,11.94041.89654,17.86578l-.50154,1.40609C884.85942,577.776,908.6886,576.25184,929.09776,565.83015Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#f0f0f0"}"></path><path d="${"M964.82992,511.54541a90.24507,90.24507,0,0,1-40.07948,38.42615,38.86258,38.86258,0,0,1-11.58823,3.73867,22.28946,22.28946,0,0,1-11.60976-1.68121c-3.43335-1.41132-6.78187-3.25255-10.49851-3.8047a13.64792,13.64792,0,0,0-10.69987,3.17694c-3.7164,3.02918-6.12273,7.21308-8.33374,11.38636-2.4549,4.63362-4.93135,9.48541-9.26735,12.65092-.52536.38355.10049,1.17631.62506.79334,7.54389-5.50744,9.36042-15.43218,15.53713-22.09407,2.88217-3.10856,6.71859-5.36737,11.07958-5.0185,3.81348.30507,7.26812,2.20081,10.73212,3.65985a23.78449,23.78449,0,0,0,11.29059,2.06681,35.92754,35.92754,0,0,0,11.68922-3.27935,87.55383,87.55383,0,0,0,22.82538-15.0936,91.84523,91.84523,0,0,0,19.238-24.55807c.30709-.571-.635-.9368-.94014-.36954Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M930.40256,547.6294a13.53964,13.53964,0,0,0,16.84965,4.84511c.59131-.26952.20027-1.20105-.39183-.93117a12.53742,12.53742,0,0,1-15.66448-4.539c-.35715-.543-1.14845.0852-.79334.62506Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M903.19905,552.9739a26.09659,26.09659,0,0,1,10.14828-16.08454c.524-.3854-.1017-1.17827-.62506-.79335a27.1444,27.1444,0,0,0-10.52618,16.75889c-.12106.63983.88256.75535,1.003.119Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M953.079,528.88983a7.66408,7.66408,0,0,1-2.133-6.95249c.1291-.638-.8747-.75281-1.003-.119a8.58826,8.58826,0,0,0,2.34259,7.69654.522.522,0,0,0,.70921.08414.50756.50756,0,0,0,.08414-.7092Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M904.56124,463.33134c-.09194.39607-.18389.79214-.28371,1.19151a100.93156,100.93156,0,0,1-5.06445,15.56964c-.1567.39258-.32143.78807-.48909,1.17532a106.40467,106.40467,0,0,1-21.84356,32.51984,103.33227,103.33227,0,0,1-11.83236,10.3196c-5.80077,4.329-12.43472,8.56119-16.35134,14.38232a17.72845,17.72845,0,0,0-1.13094,1.88006l12.75487,35.11685c.069.06526.13025.1338.19943.19946l.44515,1.42539c.22791-.14655.46114-.30344.689-.45.13256-.08446.26228-.17675.39483-.2612.08748-.05879.17486-.118.25715-.166.02919-.01946.05824-.0393.07946-.05587.08229-.048.15363-.10141.22791-.14654q1.95916-1.31007,3.90673-2.65224c.008-.00291.008-.00291.0132-.01365a151.9357,151.9357,0,0,0,27.18632-23.47793c.23818-.26807.48453-.53866.71689-.82277a98.60258,98.60258,0,0,0,9.60338-12.9109,87.1682,87.1682,0,0,0,4.25959-7.72319,72.48662,72.48662,0,0,0,6.57862-21.68811c2.07529-15.01046-.67313-30.51754-9.62425-42.5026C905.02492,463.93388,904.79847,463.63486,904.56124,463.33134Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#f0f0f0"}"></path><path d="${"M904.14421,463.57217a90.24508,90.24508,0,0,1-8.866,54.81175,38.86267,38.86267,0,0,1-7.00162,9.962,22.28937,22.28937,0,0,1-10.28194,5.64752c-3.59106.94026-7.3732,1.48618-10.67317,3.283a13.64793,13.64793,0,0,0-6.63051,8.97867c-1.14356,4.65616-.54589,9.44555.20135,14.10886.82967,5.17771,1.77346,10.54258.21727,15.68063-.18855.62255.78846.87872.97672.25712,2.70751-8.93933-1.81746-17.95736-.89662-26.99531.42967-4.21727,2.13288-8.33061,5.82493-10.67766,3.22853-2.0524,7.12823-2.6187,10.77248-3.5393a23.78438,23.78438,0,0,0,10.25927-5.14748,35.92751,35.92751,0,0,0,7.35879-9.65609,87.55379,87.55379,0,0,0,9.1374-25.79385,91.84528,91.84528,0,0,0,.57481-31.19085c-.09857-.64078-1.07107-.36563-.97314.271Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M898.381,513.11088a13.53964,13.53964,0,0,0,16.37059-6.27611c.30986-.57121-.56321-1.07955-.87348-.50758a12.53741,12.53741,0,0,1-15.24,5.807c-.61207-.2185-.86568.75947-.25711.97673Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M879.87823,533.75655a26.09656,26.09656,0,0,1-1.58117-18.95257c.18634-.6232-.79061-.87956-.97673-.25711a27.14439,27.14439,0,0,0,1.68545,19.71852c.28856.58375,1.15944.07174.87245-.50884Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M905.20431,484.49558a7.66406,7.66406,0,0,1-5.88893-4.267c-.281-.58712-1.15164-.07446-.87245.50884a8.5882,8.5882,0,0,0,6.50427,4.73485.522.522,0,0,0,.61692-.3598.50755.50755,0,0,0-.35981-.61692Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M871.49841,246.80994h-143.79v9.25a2.03965,2.03965,0,0,0,.46045,1.3c-.29,7.23005-.46045,16.46-.46045,26.49v247.3c0,23.18.93018,42.04,2.07032,42.04h139.6499c1.14014,0,2.06982-18.86,2.06982-42.04v-247.3c0-10.03-.16992-19.25994-.46-26.49a2.03925,2.03925,0,0,0,.46-1.3Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M869.42859,574.18994H729.77869c-1.08838,0-1.80738,0-2.46143-13.27832-.39258-7.96826-.60889-18.53808-.60889-29.76172V283.8501c0-9.69385.16382-19.11572.46119-26.53028.186-4.45166.39917-8.01757.6333-10.60009.45947-5.05567.89648-5.90967,1.97583-5.90967h139.6499c1.07935,0,1.51611.854,1.97583,5.90967.23462,2.59228.44751,6.1582.63306,10.59814l.00024.00195c.29712,7.40674.46069,16.82862.46069,26.53028V531.1499c0,11.22412-.21606,21.79395-.60864,29.76172C871.236,574.18994,870.517,574.18994,869.42859,574.18994Zm-139.08179-2H868.86047c.72364-2.73291,1.63794-17.57031,1.63794-41.04V283.8501c0-9.6753-.16308-19.06787-.459-26.44824h-.00024c-.18409-4.40821-.395-7.94141-.62647-10.50147a28.88406,28.88406,0,0,0-.56177-4.09033H730.35632a28.89649,28.89649,0,0,0-.56176,4.09033c-.2312,2.55029-.4419,6.0835-.62671,10.50147-.29615,7.38671-.45948,16.78027-.45948,26.44824V531.1499C728.70837,554.61914,729.62293,569.457,730.3468,572.18994Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M869.42859,241.80994H729.77869a2.07433,2.07433,0,0,0-2.07032,2.07v12.18a2.03965,2.03965,0,0,0,.46045,1.3,2.0795,2.0795,0,0,0,1.60987.77h139.6499a2.08023,2.08023,0,0,0,1.60986-.77,2.03925,2.03925,0,0,0,.46-1.3v-12.18A2.0739,2.0739,0,0,0,869.42859,241.80994Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#cacaca"}"></path><circle id="${"b800b2fc-3bcc-4a40-9972-a80335d602c8"}" data-name="${"Ellipse 90"}" cx="${"505.55903"}" cy="${"17.56535"}" r="${"2.93962"}" fill="${"#fff"}"></circle><circle id="${"fa63cc97-e384-451c-9b8c-3b6845b8b0f6"}" data-name="${"Ellipse 91"}" cx="${"516.71687"}" cy="${"17.56535"}" r="${"2.93962"}" fill="${"#fff"}"></circle><circle id="${"beaeadfc-8efd-4e6c-adaf-945ac9d4d623"}" data-name="${"Ellipse 92"}" cx="${"527.87522"}" cy="${"17.56535"}" r="${"2.93962"}" fill="${"#fff"}"></circle><path d="${"M858.49841,245.45H845.64832a.95609.95609,0,0,0-.94971.95.80091.80091,0,0,0,.1001.41.94344.94344,0,0,0,.84961.54h12.85009a.948.948,0,0,0,.86036-.54.91378.91378,0,0,0,.08984-.41A.94956.94956,0,0,0,858.49841,245.45Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M858.49841,249.02H845.64832a.95.95,0,0,0,0,1.9h12.85009a.95.95,0,1,0,0-1.9Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M858.49841,252.59H845.64832a.95.95,0,0,0,0,1.9h12.85009a.95.95,0,1,0,0-1.9Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M813.49841,284.83H787.05847a5.002,5.002,0,0,0-5,5v22.9a5.0084,5.0084,0,0,0,5,5h26.43994a5.0147,5.0147,0,0,0,5-5v-22.9A5.00824,5.00824,0,0,0,813.49841,284.83Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#6c63ff"}"></path><path d="${"M846.34851,332.68994h-92.1499a2.27,2.27,0,1,0,0,4.54h92.1499a2.27,2.27,0,1,0,0-4.54Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M789.19861,343.33h-35a2.27,2.27,0,1,0,0,4.54h35a2.27,2.27,0,1,0,0-4.54Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M813.49841,383.83H787.05847a5.002,5.002,0,0,0-5,5v22.9a5.0084,5.0084,0,0,0,5,5h26.43994a5.0147,5.0147,0,0,0,5-5v-22.9A5.00824,5.00824,0,0,0,813.49841,383.83Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#6c63ff"}"></path><path d="${"M846.34851,431.68994h-92.1499a2.27,2.27,0,1,0,0,4.54h92.1499a2.27,2.27,0,1,0,0-4.54Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M789.19861,442.33h-35a2.27,2.27,0,1,0,0,4.54h35a2.27,2.27,0,1,0,0-4.54Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M813.49841,482.83H787.05847a5.002,5.002,0,0,0-5,5v22.9a5.0084,5.0084,0,0,0,5,5h26.43994a5.0147,5.0147,0,0,0,5-5v-22.9A5.00824,5.00824,0,0,0,813.49841,482.83Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#6c63ff"}"></path><path d="${"M846.34851,530.68994h-92.1499a2.27,2.27,0,1,0,0,4.54h92.1499a2.27,2.27,0,1,0,0-4.54Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M789.19861,541.33h-35a2.27,2.27,0,1,0,0,4.54h35a2.27,2.27,0,1,0,0-4.54Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M688.49841,234.87994a2.0739,2.0739,0,0,0-2.06982-2.07H316.77869a2.07433,2.07433,0,0,0-2.07032,2.07v12.18a2.01687,2.01687,0,0,0,.53028,1.37c-.33008,8.27-.53028,19.17-.53028,31.11v274.91c0,25.78.93018,46.74,2.07032,46.74h369.6499c1.14014,0,2.06982-20.96,2.06982-46.74v-274.91c0-11.94-.1997-22.84-.52978-31.11a2.01645,2.01645,0,0,0,.52978-1.37Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M686.42859,602.18994H316.77869c-1.13,0-1.81214,0-2.46179-14.6582-.39246-8.855-.60853-20.60352-.60853-33.082V279.54c0-11.50733.1886-22.56983.53113-31.1499.65735-16.58008,1.406-16.58008,2.53919-16.58008h369.6499c1.13306,0,1.88184.00293,2.53931,16.58008h0c.342,8.57226.53051,19.63476.53051,31.1499V554.44971c0,12.479-.21606,24.22754-.60839,33.082C688.2406,602.18994,687.55847,602.18994,686.42859,602.18994Zm-369.06616-2H685.84485c.81811-3.13525,1.65356-20.74023,1.65356-45.74023V279.54c0-11.48926-.188-22.52393-.529-31.06983v-.00048c-.4165-10.50342-.90283-13.69971-1.13525-14.65967H317.37329c-.23254.96-.71887,4.15625-1.1355,14.65967-.34143,8.55468-.52942,19.58886-.52942,31.07031V554.44971C315.70837,579.44971,316.544,597.0542,317.36243,600.18994Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M686.42859,232.80994H316.77869a2.07433,2.07433,0,0,0-2.07032,2.07v12.18a2.01687,2.01687,0,0,0,.53028,1.37,2.05118,2.05118,0,0,0,1.54.7h369.6499a2.0512,2.0512,0,0,0,1.54-.7,2.01645,2.01645,0,0,0,.52978-1.37v-12.18A2.0739,2.0739,0,0,0,686.42859,232.80994Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#cacaca"}"></path><circle id="${"b7005a6f-2f7f-4001-b097-d8b6c117468f"}" data-name="${"Ellipse 90"}" cx="${"92.55903"}" cy="${"8.56535"}" r="${"2.93962"}" fill="${"#fff"}"></circle><circle id="${"a0adf4f5-8105-4330-a35a-c3adb8f4e7bc"}" data-name="${"Ellipse 91"}" cx="${"103.71687"}" cy="${"8.56535"}" r="${"2.93962"}" fill="${"#fff"}"></circle><circle id="${"a64b73a5-7207-44c1-bcaf-f99ab7b9c6dc"}" data-name="${"Ellipse 92"}" cx="${"114.87522"}" cy="${"8.56535"}" r="${"2.93962"}" fill="${"#fff"}"></circle><path d="${"M675.49841,236.45H662.64832a.95.95,0,0,0,0,1.9h12.85009a.95.95,0,1,0,0-1.9Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M675.49841,240.02H662.64832a.95.95,0,0,0,0,1.9h12.85009a.95.95,0,1,0,0-1.9Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M675.49841,243.59H662.64832a.95.95,0,0,0,0,1.9h12.85009a.95.95,0,1,0,0-1.9Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M436.25867,293.83H392.99841a8.18973,8.18973,0,0,0-8.17968,8.18v37.47a8.18973,8.18973,0,0,0,8.17968,8.18h43.26026a8.18974,8.18974,0,0,0,8.17969-8.18V302.01A8.18974,8.18974,0,0,0,436.25867,293.83Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#6c63ff"}"></path><path d="${"M614.68836,308.32H463.90857a3.715,3.715,0,0,0,0,7.43H614.68836a3.715,3.715,0,0,0,0-7.43Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M521.17859,325.72992h-57.27a3.715,3.715,0,0,0,0,7.43h57.27a3.715,3.715,0,0,0,0-7.43Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M436.25867,393.83H392.99841a8.18973,8.18973,0,0,0-8.17968,8.18v37.47a8.18973,8.18973,0,0,0,8.17968,8.18h43.26026a8.18974,8.18974,0,0,0,8.17969-8.18V402.01A8.18974,8.18974,0,0,0,436.25867,393.83Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#6c63ff"}"></path><path d="${"M614.68836,408.32H463.90857a3.715,3.715,0,0,0,0,7.43H614.68836a3.715,3.715,0,0,0,0-7.43Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M521.17859,425.72992h-57.27a3.715,3.715,0,0,0,0,7.43h57.27a3.715,3.715,0,0,0,0-7.43Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M436.25867,493.83H392.99841a8.18973,8.18973,0,0,0-8.17968,8.18v37.47a8.18973,8.18973,0,0,0,8.17968,8.18h43.26026a8.18974,8.18974,0,0,0,8.17969-8.18V502.01A8.18974,8.18974,0,0,0,436.25867,493.83Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#6c63ff"}"></path><path d="${"M614.68836,508.32H463.90857a3.715,3.715,0,0,0,0,7.43H614.68836a3.715,3.715,0,0,0,0-7.43Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M521.17859,525.72992h-57.27a3.715,3.715,0,0,0,0,7.43h57.27a3.715,3.715,0,0,0,0-7.43Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M752.43145,667.18994H504.78266c-1.14175,0-2.07052-17.54946-2.07052-39.12333v-230.134c0-21.57387.92877-39.12334,2.07052-39.12334H752.43145c1.14175,0,2.07052,17.54947,2.07052,39.12334v230.134C754.502,649.64048,753.5732,667.18994,752.43145,667.18994Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M752.43152,668.18994H504.78259c-1.0476,0-1.80468,0-2.46191-12.41846-.39258-7.415-.60864-17.2539-.60864-27.70507V397.93262c0-10.45069.21606-20.29.60864-27.70459.65723-12.41895,1.41431-12.41895,2.46191-12.41895H752.43152c1.04761,0,1.80469,0,2.46191,12.41895.39258,7.41455.60865,17.2539.60865,27.70459V628.06641c0,10.45117-.21607,20.29-.60865,27.70507C754.23621,668.18994,753.47913,668.18994,752.43152,668.18994Zm-247.09546-2h246.542c.71778-2.59082,1.624-16.394,1.624-38.12353V397.93262c0-21.7295-.90625-35.53272-1.624-38.12354h-246.542c-.71777,2.59082-1.624,16.394-1.624,38.12354V628.06641C503.712,649.7959,504.61829,663.59912,505.33606,666.18994Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M752.43145,375.12966H504.78266a2.07278,2.07278,0,0,1-2.07052-2.07051V360.87979a2.07279,2.07279,0,0,1,2.07052-2.07052H752.43145a2.07279,2.07279,0,0,1,2.07052,2.07052v12.17936A2.07278,2.07278,0,0,1,752.43145,375.12966Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#cacaca"}"></path><circle id="${"a9432236-99f6-4733-9920-e312ad95354d"}" data-name="${"Ellipse 90"}" cx="${"280.55903"}" cy="${"134.56535"}" r="${"2.93962"}" fill="${"#fff"}"></circle><circle id="${"fc8d1cb9-e477-4d66-a241-a00170356ca4"}" data-name="${"Ellipse 91"}" cx="${"291.71687"}" cy="${"134.56535"}" r="${"2.93962"}" fill="${"#fff"}"></circle><circle id="${"bc1189a4-69b8-41a6-80e2-1e52c3b8abfb"}" data-name="${"Ellipse 92"}" cx="${"302.87522"}" cy="${"134.56535"}" r="${"2.93962"}" fill="${"#fff"}"></circle><path d="${"M741.49915,364.35211H728.65048a.95175.95175,0,0,1,0-1.90351h12.84867a.95176.95176,0,0,1,0,1.90351Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M741.49915,367.92118H728.65048a.95175.95175,0,0,1,0-1.9035h12.84867a.95175.95175,0,1,1,0,1.9035Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M741.49915,371.49026H728.65048a.95175.95175,0,0,1,0-1.90351h12.84867a.95176.95176,0,0,1,0,1.90351Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#fff"}"></path><path d="${"M580.88245,450.72656H549.28922a5.98137,5.98137,0,0,1-5.97452-5.97452V417.38882a5.98137,5.98137,0,0,1,5.97452-5.97453h31.59323a5.98138,5.98138,0,0,1,5.97453,5.97453V444.752A5.98137,5.98137,0,0,1,580.88245,450.72656Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#6c63ff"}"></path><path d="${"M711.187,427.42591H601.07653a2.71246,2.71246,0,0,1,0-5.42492H711.187a2.71246,2.71246,0,0,1,0,5.42492Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M642.89822,440.13986H601.07653a2.71245,2.71245,0,1,1,0-5.42491h41.82169a2.71246,2.71246,0,1,1,0,5.42491Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M580.88245,531.72656H549.28922a5.98137,5.98137,0,0,1-5.97452-5.97452V498.38882a5.98137,5.98137,0,0,1,5.97452-5.97453h31.59323a5.98138,5.98138,0,0,1,5.97453,5.97453V525.752A5.98137,5.98137,0,0,1,580.88245,531.72656Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#6c63ff"}"></path><path d="${"M711.187,508.42591H601.07653a2.71246,2.71246,0,0,1,0-5.42492H711.187a2.71246,2.71246,0,0,1,0,5.42492Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M642.89822,521.13986H601.07653a2.71245,2.71245,0,1,1,0-5.42491h41.82169a2.71246,2.71246,0,1,1,0,5.42491Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M580.88245,612.72656H549.28922a5.98137,5.98137,0,0,1-5.97452-5.97452V579.38882a5.98137,5.98137,0,0,1,5.97452-5.97453h31.59323a5.98138,5.98138,0,0,1,5.97453,5.97453V606.752A5.98137,5.98137,0,0,1,580.88245,612.72656Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#6c63ff"}"></path><path d="${"M711.187,589.42591H601.07653a2.71246,2.71246,0,1,1,0-5.42492H711.187a2.71246,2.71246,0,1,1,0,5.42492Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path><path d="${"M642.89822,602.13986H601.07653a2.71245,2.71245,0,1,1,0-5.42491h41.82169a2.71246,2.71246,0,1,1,0,5.42491Z"}" transform="${"translate(-234.16922 -231.81006)"}" fill="${"#e4e4e4"}"></path></svg>`;
    });
    Hero = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `<div class="${"container mx-auto max-w-[80%]"}"><div class="${"flex items-center justify-center text-center md:justify-around md:w-5/6 md:text-left"}"><div class="${"flex flex-col w-5/6 md:w-3/5 lg:w-2/4 large:max-w-xl"}"><h1 class="${"text-4xl font-bold text-primary-800 md:-mt-32 md:text-6xl"}">Hello, I&#39;m Mac
      </h1>
      <p class="${"py-10 md:py-4"}">an avid frontend developer utilising cutting edge technologies to build
        websites you&#39;ll be happy with.
      </p>
      <button class="${"self-center max-w-xs px-12 lg:self-auto md:px-auto primary"}">More about me</button></div>
    <div class="${"hidden w-2/5 md:1/5 md:block"}">${validate_component(Hero_image, "HeroImage").$$render($$result, {}, {}, {})}</div></div></div>`;
    });
    load2 = async ({ fetch: fetch3 }) => {
      const projects = await fetch3("/api/projects.json");
      const allProjects = await projects.json();
      return {
        props: { projects: allProjects.slice(0, 3) }
      };
    };
    Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { projects } = $$props;
      if ($$props.projects === void 0 && $$bindings.projects && projects !== void 0)
        $$bindings.projects(projects);
      return `${$$result.head += `${$$result.title = `<title>Mac | Frontend Developer</title>`, ""}`, ""}
${validate_component(Hero, "Hero").$$render($$result, {}, {}, {})}
${projects.length > 0 ? `<div class="${"container flex-col"}"><h2 class="${"title"}">Projects</h2>
    ${validate_component(Project_list, "ProjectList").$$render($$result, { projects }, {}, {})}
    <button class="${"primary"}">View All
    </button></div>` : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/6.js
var __exports3 = {};
__export(__exports3, {
  css: () => css3,
  entry: () => entry3,
  index: () => index3,
  js: () => js3,
  module: () => index_svelte_exports
});
var index3, entry3, js3, css3;
var init__3 = __esm({
  ".svelte-kit/output/server/nodes/6.js"() {
    init_index_svelte();
    index3 = 6;
    entry3 = "pages/index.svelte-2765d125.js";
    js3 = ["pages/index.svelte-2765d125.js", "chunks/index-db76da04.js", "chunks/project-list-5ea5c07d.js"];
    css3 = [];
  }
});

// .svelte-kit/output/server/entries/pages/about.svelte.js
var about_svelte_exports = {};
__export(about_svelte_exports, {
  default: () => About
});
var About;
var init_about_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/about.svelte.js"() {
    init_index_829c628b();
    About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${$$result.head += `${$$result.title = `<title>About | Mac</title>`, ""}`, ""}
<div class="${"container flex-col py-6"}"><h1 class="${"title"}">About</h1>
  <img src="${"data:image/png;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCADIAMgDASIAAhEBAxEB/8QAHAAAAAcBAQAAAAAAAAAAAAAAAAECAwQFBgcI/8QAOxAAAQMCBAQEBAUDBAEFAAAAAQIDEQAEBRIhMQZBUWETInGBBzKRoRSxweHwQlJiFSPR8QgkJjNDgv/EABoBAAIDAQEAAAAAAAAAAAAAAAABAgMEBQb/xAAmEQACAgIDAAIABwEAAAAAAAAAAQIRAyEEEjETQQUUFSIyUWFC/9oADAMBAAIRAxEAPwD0IBQilRQFQGFGtCNaVE0cUAJIooilxQigBB0oAb0rnRxQAmKUBQqp4rx214bwV/EL1XkTCUJkStZ0CR7/AEGtJtJWxpW6RaOONstKcdWlDaQSpSiAEgamSdAIrlvGXxu4fwB9Fvh7L2KvqOpbBQ2Nf7iNTzGhB61zvjvjy9x66No8Itfm/DSPDA/z/uP1AO0b1j1fgXVJJFo04BpDZTv9j7ntWSfKSdI1Q4tq2dVX/wCQlgltaxhyRmy+GPGJy9c3lmfarrh/46YFiJAvbZ20SdfEQouADbUQD351wTHbS/TbpXZ+F+G2CENDITMcjH3JrLOXiWbjLf2SbO5QZztFTRMdQZBHtJqcMjltBLFGPp7Vw34hcMYg4tLeKMtALypU/wD7QV382gEzvBn2rUMutPpzMOocRMShUjrvXhJ1V07cMKdeWht2QlyRCsycu406dY212G3+HfHmJ8F3N7btqZuGnCgkP7CDACY1G56gx01qayP7K5YftHrqKIispwfx3hfETbbZdatr5RI/DqcmY6Hc6ERsa10VammUtV6IIoRSiKEUxCIoAUuKKmITFAilEUDQAihRkUKQCQKEUcb0caUAFFHR+tCihoT7UKUaKKACIohvSoo6AIOM4gzhOF3N7cEBthsrMmNAJ3ryVx/xziHE63/Fu1ttuvjwLdKiENJAkHXdR319B0rp3/kJxHcLdTgFmshst+I+ASMxOoBI5c+eveuR8O4Cp5SFuKSsvEiMsxCuc6aVlyZd0a8OL7ZFDD71m2pCip3KErJ11HWfU+9RWry5Zui3cW5UhRjMkyfUg799q6/h+D2bSEILYWQAFchVqxw9hz6kgWbSgd/LtWX12dKOFpHJsMxm0ZeDV2FWmfQOgeU9lDePqD9a0eJYS7iFmpbaLa+RzbhKgR1QYgHtoe52Gwxjgm0vGoatwgxEpT/BVEzgicEuMxU4nKqZSY09No7bVBpraG8Vo5xc8Ot26/FYYdYcSDmtnNUKBn5SZI6xJE9NBUD/ANKpMhhaHUzopMhYEaSdQe515ydq6xjN6hIbUUh5vcdYP/f85ZjE8Ns721u3WidPNlJ5if009DVkcvb0oliozvDF1+AuV3Sk+GGnjLrSSDG+p5dOg/P2BwJjKsf4Xs79zL4qk5VhKpgg8+8RXkbAbFu5wh5p8KlK1NFYOqoO4jWZ/eu9fALHlOYcrAroDxrZOdpQEZknUgxzkz76aVowzXajHnhqzr1CjihFbDGJiipZoooATFA0oiiIoAKKFHFCgBIFHFHFHQAmKEUqKEUAIoRSiKI6CgBJppxwJnWg6uKqr64yJJnaotjWzzj8WLz/AN/Yu47GdsoI9MukfQUOCWlOPpKgMraIGkan9eVJ+KaQOLry4y+Z5KMunRMT+dW3AFsU2aVrnzHTuK503s6vHSpGts7TXOoAfetBYsJlMJAMaVCbT5UxtVrZNgQeVOKNrbosmLdKUTB+9R7/AAu0vm1JdQCoiAYgiampJjQfaiAWknQanpVzSaKE2mc1xvgu4Dy1MKzWyRmA5z0FZLiDAVWztskZm0Owhw68hsBzrujpVB2qrxCwt7wJTctJWEKCh2IqiWH7RZ8lqmcYxfCkYZw+ybVtRKlwVRBSB+pP29qvPgih+344tTcQXrhpxSgOpEzHLY1qeM7IHBH0sNiEJzADtrUL4M2we4xS4EHLb2y1anYyE/TU08UakkYs/wDE7uaTSjvQrpHMExQilUKAExQilUUUAJoUoihQITRxRgUcUDExQilRQigBBptxQ1M6U8RpTD21A0Qrleh1rOYw+UoVFX13say+M6pIG5qqbpWTgraRxH4nuZ8YYQqc2XboRJnXccq03Dy1NcP2jjCc6sgyiYk9z61R4/hF1f2CH8RK1XjQWUOEAZkFZEEcyBBnmN62HBliVYLbgggITA+//FYL7M7PxfDLqgW6sajxShgzqEzAT7nWqdzinG27tdq8wwhQMAIWkyPrP5VdcQYReXimAytSGcw8QlU6dAnae5BisrhHA9+cTCsUuFrw5Lri8viFSlAghMpUSmPlMRprvoKvhC16Oc3FrVnTOGsXduWEi5IDnMDrV+XwEFSvlGtcwtWX8JvWihaQhZKCgKJAg6EE67Qe22oraPXTisOCk78+0VXGf0WvH2/cUPF3EGJW5KsPKEtokkmBPaTpUHhrH8dxBkJvLdoubhQWgEjpAMz3gVKxPh8YrYutqWrxFtqCXUKKVJWQdZ3ABIMCJ1qjwH4eXtniCrh/EM+iUpbzKUnTcmeZAGuh51bGNxuymTqVUbQOLfZWzdtkEtmTy9PWoXwP/DoxfE860h4MpQ3JAKgVEmAd9k1oGLGLbI5JKRAJ13Eb1U/D/B02V1bXKkhT7ywlWnypSo/eftUU6kmZ8kO9o65RxQFGa3HKCihFHFCKKAKKKlUCKKATFCjIoUUIKjijihFFDCihFHFA0UAgjSmHRpUk0y7zoGiruk6GsvjMBJ7a1qbvaslxC5lbX71XPwlF7MPxVapuF25aUPGQlJbn/LQiemsGrzhpQFgwG9AUAR3HL6zVSppjFMOdYdlWWUqE6pn+pJ9o9ae4RUGGlWqnFLLKynMsiVaAye+9YHqR6HvHJBSNkGwtMlIPrSXG0JQRlG3SnWNQmDoRrTdwrzFMmKs7UiuME2Y3F4ViQSdVA6R1q6aSr8EkgZpG8msrimJWLF/eXN9cpaSw4WoJJy6Dl960dhjmGLwIvpdC2QJCkyrnyA1JnSOtVR9s2NNKi0wltWXyny8uc1dNtg6mqDhq/YvGXHbFwrYVrqkpg7RB15bVoGVHKZ/KroyMmWP2NOyCR12qRg1mhi9SgKKs6/EgnY8wOQFNORoOZ2661bYDaZXS6SVAJgFRkn1NWRjbRkyTUYtl8BpSook0dazkhRRxRxQj0oAKKBo4oRQAmKFKihQAQoRR8qHKgAooRRxQigBJFMujSnzTTmxpMCpvE6GsdxEglpcdDW2u06HSstjbOZtWlQkiSdM5Bf3D1ncKcYWULE/yOYqy4QvncRXduLSlDgWB5Ntt9detM8RWZS6sgb1F4Fe/D4jdNKHlWAoabEf91jnH7N2DI7o6XZ3RS0EqJmIppby3FKAPnkb6xUN85C24jYGDHQ1Mu2FO2oNvcKYdOygkH7c/tVf2dLHKiOrCrW4uPGuLZrxNIcyjNp33I7VPt8NsbZ0uNtJRI100HftWc/0vF3PLc4i44J3bQlI9h+5p1OAXbpUBiNzk08iQBr6EQKsSSNXRSVuRp2kI8TOxlg6aGKlMLIclQITzrO4fw67a3CHXMQuUgTmbCk+b1029K0bgASlKddh6+tNpWZMzUVp2PMp8a5aBJAK0j771rbZpLLQQgQB9+5rM4ekLxBhCZMKk9o1rWJ5VpxLVnH5Dd0KTSqIbUqrjMFQijoEUACiilDaiNABEUKOhQAmj0o6EUAFFA0dCgBJppzanjTahIoAg3KZBqhxFnMk6b1onk6VU3iNDpUWrGjm3EdmCFeXryrH2DZZv7goSZDJV9CK6XjrIUkyK51bXyG+PW8LhOVy0WpR382ZMDtpNUZMbadGjBJKaL/DMTaumMpV5gNulW1m8pSWwdRMECsZj+HP2TpuLXMIPLpvFK4e4mSh0MXflVyJ0msfvp1laejpdqlJVI2qa02AqQDVBZYox5FJcRChO8xptU9GNMkEB1HTfnNWJClJsmv8AlOnr/PrUVy5S2SpSgAke1VWKcQWbCDDocWQcqEmSrXpTeCW1ziDour5ORqZQ2enU9T+VNLZXJ2jfcLW02/41z53ZyD+1IP8A1NaBIql4Xv7W8tHmLV5K3LNzwXkj+hRAVHpBHblvV4kVuiqikcjI7kxVCKA0o6kQBFCjoRQAIoRQo4pgJoUcUKQgtqEUcUIoGFFDnRxQigBMUShvSyKIigCI6nQ1WXaNDVu+UttlTiglCQSSdAI79K5F8TPihZYO05aYE41d3+yngczbP00UfsOc7VOGKWR1EjKagrZN4sxbDsKKEYhdNMuOmEN7rX6J3jvt1rz9h+OFHHjWJ3JhKnT4mvyoUcpHoJSfaqy6xW4usd/GXzrlxdvpUA4skyYP00mBtGlV7fnv3EgyPCKvfMnWujDhqCafpn/MO00enLiz/EMkFOaRO381rnmM8NqW+SlKoJ6RXQPh/fDFuF7J0yXEI8Jzn5k6T+R96s8TscqwsJETXAyYesmj0eLOpRTOWWvBGJulKWr11A9z7VZMfDO/ccBdxF8I1kgmf2rodvmS2AnQipSb8ItnEkEuTHtFQWNIm8rvRisM4VtcGcbbzKeeUQC44oqMz9a2rqQ1bgJ0AGkHtUGxZXdXwWdQjX/upOPXKLLD7h90gJaQVSTzianCH9FOSZi/hJjKbL4ocUWty8lu3unIBWcoK0gRrtzUPWBXewNJFeNbRw3D9486PPeqcB12KgYPrt71M4Y494gwBbQtcSf/AA6TAacPiIjsD+xrufkJSimjgz5KU3Z7AihXKeFvjNhV4lDHELSsPu9lOoBWwroQR5h76DrXT8Pv7TErZNxh90zcsK2caWFg/Q71jyYp4/5ItjOMvCQKAo4o9KrJhUKOhQAVCjoUAJ50Io4oHQa7CgAoolEJBJIAiTygVkOJviLw/gTSyu6TdviYatyFfVW33muF8Z/EHGuLHVshz8HhxOlu0qAR/kd1fl2rRi4s8jKp5owO5458RuHMKU42Lz8Y+ndu1AXHqr5R9ZrA4x8a7nMUYThLEmQlTzil/UCB7Sa42gmFpS7ABlbi9hH5/Soj980htTdopTqlSFvK59hzj7etdCHCxr3ZllyJGh4r44xvH1K/1K9UtIOjLRKGkegET6mSOXWsdcrQppaVHU+8wRqfrSVvAKKioBAG88+lQmnXLq7lMJbTPeQP3rbCEYKkjLKbl6NYgvx7hllvyrSkrSsbgjb70MIWbjE1qylEsGUxscyZA7UFR/qykAfI306yf1prh15pjFMRduFpQ223mUTrAkchvsKqnp2W47ao7r8EMU8K/usLdUcjiQ83PJQ0P6fSux3jActzAHI15E4J46ab48wnwUhm0S9lW858ygRHLQb7a/pXsa2yv26SDIIkHrXF5qi8naH2dfiykoUypt2UlJzAaUp+zZWCogTEVIetwlRjflSUoK1AKI0rFRs7iLK3QyhSkjSuWfFnGw8pGD2qiSf9x8p5JHI9BNan4j8bWPCtgplJL18tMpaQflkxKjyE+/oNR5KxTiW/veNmcRunVBXigf8A5J1Hoa28bC01kmtGTPmu4Rezf3DwtfBUCEpRKiY2gnX7VSeIXEJcIlO/TSNj7xNWF4qWlNkgkAp3661W24KFlpUf3J0r0aWrRwXLeych7xW0JUdgYPMdvSrHBMcxLBbvxsJvX7V2RPhKMKj+4bEeoIqjUytK0qQY3B12p0LW0qRC9I25UmlJVJAm14zvnCPxqXlbY4mtM5iPxNtAn1Tt7g+1dbwLiDCseY8TCr1t8c0gkLT6pOo+leK2L7MoEpEHuB7Qan2OJrtXkvWdyth9KvKttZSoH1Gv3rDl4EJbho1Y+S16e2qOK87cL/F7GsPLTeKBGJ20wSqEugdlbH3BJrtXCvF2EcTsFeGXILqRK2HIS4j1T+okVzc3GyYvTXDNGfhfxQoRQrOWke+u2bGzeurpYbYZSVrWeQGs15z+IvxBv8auXbe3WtmwOiWJyiCNM/NR5x8o213rUfHnipxsIwW0cKUgBx8gxJOqU/r6kVwhTi3JzkmTrrMjv2mupw+Mq7yMXIy/8ofvLgFX+64VJjMok7nqe3TtVbcX5yf7aDlKoTP9R9OnenH20hsEgFI37menSmWmYPiumV7D/GulVaRibsSsOqgKVmcOpJ2Se3XSkZdm0TkA3nc9alkpSgk/MrT9qShISiRAURA/epKKItlW634ruUlQQk/KCR9Y1JqTYIbbYK4SkKMk9aafV4FutX/2rMa8idP1px1SbeyaETsQBzpVsF4RrBPjYndORvAT2EftUBm0Bxi4YcEh5BSR16fcCr3CmC2wVOHzuKzK96U7ZtuOIc1StMmU6UunZbJqTXhiMVw5VldNuN5kNpUDnQJKdZ26/wA0rs3w6+Mj+FWSLW/vrVxLQyFp4kJI/wAFbzy5isk9atvIV4kKSZzZudUxwO2S4SbUKHVJP5TWbLw1J2i/HynFUz1rwrxphfF7U4a+3+ISJW0lwKj0I0I+hFHxNjLeA4e7c3aiI0AG6z0A615Yw1v/AE67tbjClfgsTbWFsPIUQoKGvmHNMDXrWx4v4mvOIr9y6v0lDaEkMNgyG59NzO559qyfpjeT/DZ+oLp/pBxzELXHLzEMSxFS2b1TiVNN/MlScqhlM6z8s7DnrsObcTYa444q4ZSSJkwK1Fu2p9RcWDM6T+dSPDTqCBliOs10/gi4dDmfNLv3IuAX5xLCQ4uA80QlwdT/AHD1/nKpbreoKYkGR/xTVhaNWxWGgUhRkid94qWUkga8qtxx6xpkZy7StAbOZYMaHU028gpUEZiAflPTlHrT6ExodyIpK05vIfl5mdv313qTVkbIos2RAGboIO9GkpR5UjmY9qdyLTIWoGNJ/Wo6ZzCJkkk1FxHY6l9SHAAoggzpy7mrvBsUu7C5D9stSHE+ZDjaiFCD9jrv3qlCEqMwAQR7VPtwWwDy9Nx0NLp20/BqTW0emvhPxyriOz/CYksf6i2CUrICS6kdtpGkx6jnQrgnCuNOYdjFm+04UOocBR3M7ekaelCuVn/D25tw8NuPk1H9wrjnEji2NYjdEgpW8opM/wBM6fYVj0rUlYIPeOoqxunCoxrCzz9KrzMTHbvXQxx6qkZpu3ZKVDiABGUz3qMtSM+VRMbU/bkqTAgjlyj+SKbIV4ygEjuauoqbG8gW6CSP2oSpTqiE7CE04shtJgamm2Eq8y1H9NKYivxdshmec6DrT7rPiv2yTqE6HtTGIOh6/t20nyJPiL9dYFTgchAKT4p0AGsD/n8qilbH4SFlKMqZAJ2FIWnzgCY9KDachJcELNOZwEkk+9TEmNxAEAzSEKCBqqNdqYfu0lWRIUpXQa0dvbFZzvk9QmYjue/5VEknY8iHrta0zmYaMKBiCqecaHQiYO9BK0JtEhLD4VBKg4keUknY9IPfWpWG6uPFpJ0hIykAaU7eFWVZICVZTy37yKaj9heqKtBdcgKGRO+9PpTGgGneltlLgBSCIE+1LyiCQKaQhDQg6704kSJEaaUhI84JJ/n/AFRhWWTIkazTSFewwQVdOX50hUhSZnYk0uJ3jXakLBzgmYA+9NgJuF5WtNSRA7zTKUKCCFKEnSBpUhSfOCQfLtS8oAncT9KTQkhu2RLgnWdKlPlKUFMjQRp+X50holC0rSCQVDl7z9jSbhYUoJMk852oqhilLKEMOJJzpJ56iDQqHcOEJTroFAe5P/VCo0KyVdyFpAOoknuTTAUNQImKS6C6JKzB315moLlg2SDmUHZlK0aK96rSrZY3ZZMEJUMpMTTlyUpUFAEJO/8AyarmX3bdaWrtQWkmEPREk8lfpVm8C4wCDJnY7VNOyLVEVCFOrUVbTp3qPd3KU5koI8NGiztmV09OtJCVJfWkEpKk5d+vP7Gg220s5wrKw3IR3j+o/p9elMQ1hduc67m4zJUrXUbST9asBcNIPhsAKdM8506noKrHHHL5YWklqzSdCd1xzp9i3cV5bdvIk/MtZ3/n0oigf9Eh27QwJWrMtW0ayegHSo6Gbq+OZSiw0T11IqYzaJaBA8zqiAVnp6dO360+9cpQfKREb8tKbQJf2Mt2zNqkBAjTU8z6mo76nH1hts5QZE9utOKC1kFXzqnTsf2p9LWQAmQrrG38NADmHIJStLSBlbCQddp/m9TV2jim1hQOqDMrBjSmcMSULeVAhwgAkTBFTnnVlDgUVHykaDtTXhLRWJtwkDedh7CjUkjeNae10CSSeX2pKknyyTtQAypJAERP6TRrbVvpTxRmAI2iKJzRtIEyBO3emhUMFBAGoyntFIXOgnWpaoCNIMjQGmEqCiSkBRBg89v1p0J6DDZKNxO3WjyaTsSKCXDBKgNKCvMlPm8nbc0qAUjyBIAkDfnMVALwNw4pRA0JGhEgU9dP+C3mKimRA+/2iqdgruLkL5K115IHrzJ19KTf0HpJulQhhtQ8zip96FIw8HEcbG/htEJB6nahULDqSsSt1Wr2Zp1KGyQQHJCVA+moOtISolwJWkBQ/tVmHtzj2oUKrTJtEh5CHG1IchSSNR2qOzdFkfhnVEqIOVR/qA/Xr9aFCrCJE8do2annCFZ1lKUgwTECPtv0mnUWzrjYS+mGzBUP7j0H+I0/KhQojsb0T0NITrlCl8ienp0oLfyglRGUd6FCpERnOt2SkFKDuo7dNDTyW2kBMkKOk5RPtQoUIEPojMTlKVdenajXBQAtOUmRMUKFSGO4eouBxE//ABqideYH6VYuNZWl6rJKSZIiNPyoUKEMhISZ00/5oFMqPQD70KFMELSkpAMfvSVJEpBgkkfnQoUAJcSMwSNSB05zTSrcOKKgktr2zp0mfzoUKBDRzpEOwpM/OkfmOXrRyUSCNtRHOhQoIv0obgqxDGDaInwWkhS9dzEx9adxBtaWvw1oSX3VedY009eQ7UKFVR2myyWqLbA22rbxwkCWEFatI3BA+5FChQqVFdn/2Q=="}" alt="${"avatar"}" class="${"w-32 h-32 my-4 rounded-full"}">
  <article class="${"w-5/6 max-w-lg mb-8 prose lg:mb-6"}"><p>Hello again, as you probably already found out from my home page, my name
      is Mac and I am a frontend developer. I specialise in building sleek, fast
      and easy to maintain websites these sites can hook up to a CMS if you need
      to be able to control your data, I can even add more app like
      functionality such as user sign up and much more.
    </p>
    <p>In my free time, I enjoy writing music in various genres, though I mostly
      specialise in pop punk. I also play a few video games now and then and
      would love to make my own one day.
    </p>
    <p>Anyway enough about me, you are probably more interested in the work I am
      capable of. To have a look through my projects you can click the button
      below. Make sure you click on each project to see the tools I used and
      other interesting information.
    </p>
    <h2 class="${"-mt-1"}">Mac</h2></article>
  <div class="${"flex items-center space-x-2"}"><button>Read my blog</button>
    <button class="${"primary"}">View my work</button></div></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/2.js
var __exports4 = {};
__export(__exports4, {
  css: () => css4,
  entry: () => entry4,
  index: () => index4,
  js: () => js4,
  module: () => about_svelte_exports
});
var index4, entry4, js4, css4;
var init__4 = __esm({
  ".svelte-kit/output/server/nodes/2.js"() {
    init_about_svelte();
    index4 = 2;
    entry4 = "pages/about.svelte-fd8766f7.js";
    js4 = ["pages/about.svelte-fd8766f7.js", "chunks/index-db76da04.js"];
    css4 = [];
  }
});

// .svelte-kit/output/server/entries/pages/blog/index.svelte.js
var index_svelte_exports2 = {};
__export(index_svelte_exports2, {
  default: () => Blog,
  load: () => load3
});
var Post_item, Post_list, load3, Blog;
var init_index_svelte2 = __esm({
  ".svelte-kit/output/server/entries/pages/blog/index.svelte.js"() {
    init_index_829c628b();
    Post_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { title, date, snippet, path } = $$props;
      if ($$props.title === void 0 && $$bindings.title && title !== void 0)
        $$bindings.title(title);
      if ($$props.date === void 0 && $$bindings.date && date !== void 0)
        $$bindings.date(date);
      if ($$props.snippet === void 0 && $$bindings.snippet && snippet !== void 0)
        $$bindings.snippet(snippet);
      if ($$props.path === void 0 && $$bindings.path && path !== void 0)
        $$bindings.path(path);
      return `<a${add_attribute("href", path, 0)} class="${"flex items-center w-5/6 my-4 shadow-sm rounded-2xl lg:w-1/2 md:w-4/6"}"><div class="${"p-4"}"><h2 class="${"text-xl font-semibold"}">${escape(title)}</h2>
    <span class="${"text-xs text-slate-500"}">${escape(date)}</span>
    <p class="${"py-2 line-clamp-2"}">${escape(snippet)}</p>
    <button class="${"link"}">Read more</button></div></a>`;
    });
    Post_list = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { posts } = $$props;
      if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
        $$bindings.posts(posts);
      return `<div class="${"flex flex-col items-center"}">${each(posts, (post) => {
        return `${validate_component(Post_item, "PostItem").$$render($$result, Object.assign(post.meta, { path: post.path }), {}, {})}`;
      })}</div>`;
    });
    load3 = async ({ fetch: fetch3 }) => {
      const posts = await fetch3("/api/blog.json");
      const allPosts = await posts.json();
      return { props: { posts: allPosts } };
    };
    Blog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { posts } = $$props;
      if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
        $$bindings.posts(posts);
      return `${$$result.head += `${$$result.title = `<title>Blog | Mac</title>`, ""}`, ""}
<div class="${"container flex-col py-6"}"><h1 class="${"mb-4 title"}">Blog</h1>
  ${validate_component(Post_list, "PostList").$$render($$result, { posts }, {}, {})}</div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/3.js
var __exports5 = {};
__export(__exports5, {
  css: () => css5,
  entry: () => entry5,
  index: () => index5,
  js: () => js5,
  module: () => index_svelte_exports2
});
var index5, entry5, js5, css5;
var init__5 = __esm({
  ".svelte-kit/output/server/nodes/3.js"() {
    init_index_svelte2();
    index5 = 3;
    entry5 = "pages/blog/index.svelte-e11e2ee5.js";
    js5 = ["pages/blog/index.svelte-e11e2ee5.js", "chunks/index-db76da04.js"];
    css5 = [];
  }
});

// .svelte-kit/output/server/entries/pages/links.svelte.js
var links_svelte_exports = {};
__export(links_svelte_exports, {
  default: () => Links
});
var css$1, IconBase, FaGithub, FaSnapchat, FaEnvelope, FaInstagram, css6, Links;
var init_links_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/links.svelte.js"() {
    init_index_829c628b();
    css$1 = {
      code: "svg.svelte-c8tyih{stroke:currentColor;fill:currentColor;stroke-width:0;width:100%;height:auto;max-height:100%}",
      map: null
    };
    IconBase = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { title = null } = $$props;
      let { viewBox } = $$props;
      if ($$props.title === void 0 && $$bindings.title && title !== void 0)
        $$bindings.title(title);
      if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
        $$bindings.viewBox(viewBox);
      $$result.css.add(css$1);
      return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("viewBox", viewBox, 0)} class="${"svelte-c8tyih"}">${title ? `<title>${escape(title)}</title>` : ``}${slots.default ? slots.default({}) : ``}</svg>`;
    });
    FaGithub = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 496 512" }, $$props), {}, {
        default: () => {
          return `<path d="${"M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"}"></path>`;
        }
      })}`;
    });
    FaSnapchat = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 496 512" }, $$props), {}, {
        default: () => {
          return `<path d="${"M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm169.5 338.9c-3.5 8.1-18.1 14-44.8 18.2-1.4 1.9-2.5 9.8-4.3 15.9-1.1 3.7-3.7 5.9-8.1 5.9h-.2c-6.2 0-12.8-2.9-25.8-2.9-17.6 0-23.7 4-37.4 13.7-14.5 10.3-28.4 19.1-49.2 18.2-21 1.6-38.6-11.2-48.5-18.2-13.8-9.7-19.8-13.7-37.4-13.7-12.5 0-20.4 3.1-25.8 3.1-5.4 0-7.5-3.3-8.3-6-1.8-6.1-2.9-14.1-4.3-16-13.8-2.1-44.8-7.5-45.5-21.4-.2-3.6 2.3-6.8 5.9-7.4 46.3-7.6 67.1-55.1 68-57.1 0-.1.1-.2.2-.3 2.5-5 3-9.2 1.6-12.5-3.4-7.9-17.9-10.7-24-13.2-15.8-6.2-18-13.4-17-18.3 1.6-8.5 14.4-13.8 21.9-10.3 5.9 2.8 11.2 4.2 15.7 4.2 3.3 0 5.5-.8 6.6-1.4-1.4-23.9-4.7-58 3.8-77.1C183.1 100 230.7 96 244.7 96c.6 0 6.1-.1 6.7-.1 34.7 0 68 17.8 84.3 54.3 8.5 19.1 5.2 53.1 3.8 77.1 1.1.6 2.9 1.3 5.7 1.4 4.3-.2 9.2-1.6 14.7-4.2 4-1.9 9.6-1.6 13.6 0 6.3 2.3 10.3 6.8 10.4 11.9.1 6.5-5.7 12.1-17.2 16.6-1.4.6-3.1 1.1-4.9 1.7-6.5 2.1-16.4 5.2-19 11.5-1.4 3.3-.8 7.5 1.6 12.5.1.1.1.2.2.3.9 2 21.7 49.5 68 57.1 4 1 7.1 5.5 4.9 10.8z"}"></path>`;
        }
      })}`;
    });
    FaEnvelope = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 512 512" }, $$props), {}, {
        default: () => {
          return `<path d="${"M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"}"></path>`;
        }
      })}`;
    });
    FaInstagram = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 448 512" }, $$props), {}, {
        default: () => {
          return `<path d="${"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"}"></path>`;
        }
      })}`;
    });
    css6 = {
      code: ".icon.svelte-f8pby7{width:32px;height:32px}",
      map: null
    };
    Links = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css6);
      return `<div class="${"py-8 max-h-screen flex flex-col items-center justify-center text-center prose mx-auto"}"><img src="${"g/links.jpeg"}" alt="${"Mac's avatar"}" class="${"w-32 h-32 bg-primary-500 rounded-full shadow-lg"}">
  <div class="${"flex flex-col space-y-2 max-w-[300px]"}"><h1 class="${"m-0"}">Mac</h1>
    <p>Hey I&#39;m Mac musician, developer and skater. Check out all of my links below.</p></div>
  <ul class="${"links-list"}"><a href="${"https://hyperfollow.com/nothingspecial9"}" target="${"_blank"}" rel="${"noopener noreferrer"}" class="${"no-underline"}"><li>Nothing Special
      </li></a>
    <a href="${"https://mac9.vercel.app/projects"}" target="${"_blank"}" rel="${"noopener noreferrer"}" class="${"no-underline"}"><li>Portfolio
      </li></a>
    <a href="${"https://mac9.vercel.app/blog"}" target="${"_blank"}" rel="${"noopener noreferrer"}" class="${"no-underline"}"><li>Blog
      </li></a>
    <a href="${"https://vm.tiktok.com/ZML44eMqN/"}" target="${"_blank"}" rel="${"noopener noreferrer"}" class="${"no-underline"}"><li>TikTok
      </li></a></ul>
  <div class="${"flex flex-wrap justify-center space-x-2 mt-4 items-center"}"><a href="${"https://github.com/mac-h95"}" class="${"icon svelte-f8pby7"}">${validate_component(FaGithub, "Github").$$render($$result, {}, {}, {})}</a>
    <a href="${"mailto:mac.develops@icloud.com"}" class="${"icon svelte-f8pby7"}">${validate_component(FaEnvelope, "Envelope").$$render($$result, {}, {}, {})}</a>
    <a class="${"icon svelte-f8pby7"}" href="${"https://instagram.com/mac.h95"}">${validate_component(FaInstagram, "Instagram").$$render($$result, {}, {}, {})}</a>
    <a class="${"icon svelte-f8pby7"}" href="${"https://www.snapchat.com/add/mac.h95"}">${validate_component(FaSnapchat, "Snapchat").$$render($$result, {}, {}, {})}</a></div>
</div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/7.js
var __exports6 = {};
__export(__exports6, {
  css: () => css7,
  entry: () => entry6,
  index: () => index6,
  js: () => js6,
  module: () => links_svelte_exports
});
var index6, entry6, js6, css7;
var init__6 = __esm({
  ".svelte-kit/output/server/nodes/7.js"() {
    init_links_svelte();
    index6 = 7;
    entry6 = "pages/links.svelte-9e368ec7.js";
    js6 = ["pages/links.svelte-9e368ec7.js", "chunks/index-db76da04.js"];
    css7 = ["assets/pages/links.svelte-49ea55ea.css"];
  }
});

// .svelte-kit/output/server/entries/pages/projects/index.svelte.js
var index_svelte_exports3 = {};
__export(index_svelte_exports3, {
  default: () => Projects,
  load: () => load4
});
var load4, Projects;
var init_index_svelte3 = __esm({
  ".svelte-kit/output/server/entries/pages/projects/index.svelte.js"() {
    init_index_829c628b();
    init_project_list_33529d05();
    load4 = async ({ fetch: fetch3 }) => {
      const projects = await fetch3("/api/projects.json");
      const allProjects = await projects.json();
      return { props: { projects: allProjects } };
    };
    Projects = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { projects } = $$props;
      if ($$props.projects === void 0 && $$bindings.projects && projects !== void 0)
        $$bindings.projects(projects);
      return `${$$result.head += `${$$result.title = `<title>Projects | Mac</title>`, ""}`, ""}
<div class="${"container flex-col py-6"}"><h1 class="${"title"}">Projects</h1>
  ${validate_component(Project_list, "ProjectList").$$render($$result, { projects }, {}, {})}</div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/22.js
var __exports7 = {};
__export(__exports7, {
  css: () => css8,
  entry: () => entry7,
  index: () => index7,
  js: () => js7,
  module: () => index_svelte_exports3
});
var index7, entry7, js7, css8;
var init__7 = __esm({
  ".svelte-kit/output/server/nodes/22.js"() {
    init_index_svelte3();
    index7 = 22;
    entry7 = "pages/projects/index.svelte-00f5a842.js";
    js7 = ["pages/projects/index.svelte-00f5a842.js", "chunks/index-db76da04.js", "chunks/project-list-5ea5c07d.js"];
    css8 = [];
  }
});

// .svelte-kit/output/server/chunks/_blog-2d1088ef.js
var Blog2;
var init_blog_2d1088ef = __esm({
  ".svelte-kit/output/server/chunks/_blog-2d1088ef.js"() {
    init_index_829c628b();
    Blog2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { title, date, cover, snippet, tags } = $$props;
      if ($$props.title === void 0 && $$bindings.title && title !== void 0)
        $$bindings.title(title);
      if ($$props.date === void 0 && $$bindings.date && date !== void 0)
        $$bindings.date(date);
      if ($$props.cover === void 0 && $$bindings.cover && cover !== void 0)
        $$bindings.cover(cover);
      if ($$props.snippet === void 0 && $$bindings.snippet && snippet !== void 0)
        $$bindings.snippet(snippet);
      if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
        $$bindings.tags(tags);
      return `${$$result.head += `${$$result.title = `<title>${escape(title)} | Mac</title>`, ""}<meta name="${"description"}"${add_attribute("content", snippet, 0)} data-svelte="svelte-yorm00"><meta property="${"og:title"}"${add_attribute("content", `${title} | Mac`, 0)} data-svelte="svelte-yorm00"><meta property="${"og:description"}"${add_attribute("content", snippet, 0)} data-svelte="svelte-yorm00"><meta property="${"og:type"}" content="${"article"}" data-svelte="svelte-yorm00"><meta property="${"og:image"}"${add_attribute("content", `/blog/${cover}`, 0)} data-svelte="svelte-yorm00"><meta property="${"og:article:published_time"}"${add_attribute("content", date, 0)} data-svelte="svelte-yorm00"><meta property="${"og:article:section"}" content="${"Blog"}" data-svelte="svelte-yorm00"><meta property="${"og:article:author:first_name"}" content="${"Mac"}" data-svelte="svelte-yorm00"><meta property="${"og:article:author:username"}" content="${"Mac9"}" data-svelte="svelte-yorm00"><meta property="${"og:article:author:gender"}" content="${"Male"}" data-svelte="svelte-yorm00"><meta property="${"og:article:tag"}"${add_attribute("content", tags, 0)} data-svelte="svelte-yorm00"><link rel="${"preload"}" as="${"image"}"${add_attribute("href", cover, 0)} data-svelte="svelte-yorm00">`, ""}
<article class="${"relative flex flex-col items-center p-4 mx-auto prose max-w-prose large:max-w-5xl"}"><a href="${"/blog"}" class="${"absolute top-0 left-0 py-1 pl-3 cursor-pointer"}" aria-label="${"back to main blog post page"}"><svg class="${"w-6 h-6"}" fill="${"none"}" stroke="${"currentColor"}" viewBox="${"0 0 24 24"}" xmlns="${"http://www.w3.org/2000/svg"}"><path stroke-linecap="${"round"}" stroke-linejoin="${"round"}" stroke-width="${"2"}" d="${"M10 19l-7-7m0 0l7-7m-7 7h18"}"></path></svg></a>
  <section id="${"header"}" class="${"flex flex-col items-start justify-start md:p-4"}"><img class="${"rounded-2xl aspect-2 shadow-md"}"${add_attribute("src", `../../blog/${cover}`, 0)}${add_attribute("alt", title, 0)}>
    <h1 class="${"m-0"}">${escape(title)}</h1>
    <span class="${"text-slate-500"}">${escape(date)}</span></section>
  <section id="${"content"}" class="${"md:p-4"}">${slots.default ? slots.default({}) : ``}
    <p>Thanks for reading this post.</p>
    <div class="${"flex flex-col items-start space-y-2"}"><h2>Mac</h2>
      <a href="${"/blog"}" class="${"link text-primary-700 no-underline"}">Read more posts</a></div></section></article>`;
    });
  }
});

// .svelte-kit/output/server/entries/pages/blog/ipad-for-programming.md.js
var ipad_for_programming_md_exports = {};
__export(ipad_for_programming_md_exports, {
  default: () => Ipad_for_programming,
  metadata: () => metadata
});
var metadata, Ipad_for_programming;
var init_ipad_for_programming_md = __esm({
  ".svelte-kit/output/server/entries/pages/blog/ipad-for-programming.md.js"() {
    init_index_829c628b();
    init_blog_2d1088ef();
    metadata = {
      "title": "Using an iPad for Programming",
      "date": "02.04.22",
      "cover": "ipad-programming.jpg",
      "snippet": "The iPad is an excellent media consumption device however thanks to some new tools it has become an incredible device for programming.",
      "tags": ["programming", "ipad", "codespaces", "swift"]
    };
    Ipad_for_programming = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Blog2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata), {}, {
        default: () => {
          return `<p>The iPad is an excellent media consumption device however thanks to some new tools it has become an incredible device for programming. In this post I detail some of the tools I have found myself using to improve my workflow.</p>
<p>I would highly recommend an external keyboard with the iPad if you plan on utilising this wonderful device to program on.</p>
<h2>Github Codespaces</h2>
<p>Truly a wonderful piece of technology that will save you so much time, storage space and more whether you are using it to code on the iPad or even if you are just utilising it on your laptop. </p>
<p>You can ssh into the codespaces like you would a normal server and then access the files using a terminal based editor such as vim or if you are really hardcore code everythign using echo and cat.</p>
<p>A second method for accessing codespaces is via Visual Studio Code using the Codespaces extension, this is the best way on a laptop in my opinion. </p>
<p>However the method you want to be using if you are learning to code on your iPad is via the web, you can connect to the codespace and a fully featured version of VSCode will open in your browser window, allowing you to install extensions, run terminal commands and edit your files as though you were using VSCode on your desktop. </p>
<h2>Swift Playgrounds</h2>
<p>Orginally just a simple app aimed at kids learning the logic behind computers and programming, which is a wonderful use however since then Apple have added a convenient mode which essentialy turns the iPad into the ultimate device for programming and publishing using SwiftUI, which let\u2019s be honest if you are building iOS applications you should be using SwiftUI. </p>
<p>You can even build games using SpriteKit on Swift Playgrounds now!</p>
<h2>Notes</h2>
<p>The Apple Pencil creates an incredible note taking experience allowing me to have a YouTube video or browser window open, with the Notes app on the left hand side means I can scribble some notes down and have them converted into typed text, I get the benefit of writing and sketching little diagrams without the annoyance of trying to read my hand writing later on.</p>
<h2>Procreate</h2>
<p>You might be thinking, how on earth could I a programmer use an artists tool like Procreate and to be honest other than for a few doodles when I was bored I wasn\u2019t too sure, that being said I recently started working on a new SaaS project and being able to draw out Stack Diagrams and my Database Schema charts, I really appreciated the fluid drawing tools provided by Procreate.</p>
<h2>Conclusion</h2>
<p>The iPad is a powerful and portable device that allows you to get all manners of task ranging music production to web development and is highly worth a purchase.</p>
<p><em>Featured image courtesy of <a href="${"https://www.pexels.com/photo/silver-ipad-1334598/"}" rel="${"nofollow"}">Josh Sorensen</a></em></p>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/4.js
var __exports8 = {};
__export(__exports8, {
  css: () => css9,
  entry: () => entry8,
  index: () => index8,
  js: () => js8,
  module: () => ipad_for_programming_md_exports
});
var index8, entry8, js8, css9;
var init__8 = __esm({
  ".svelte-kit/output/server/nodes/4.js"() {
    init_ipad_for_programming_md();
    index8 = 4;
    entry8 = "pages/blog/ipad-for-programming.md-2c8613c9.js";
    js8 = ["pages/blog/ipad-for-programming.md-2c8613c9.js", "chunks/index-db76da04.js", "chunks/_blog-b91c5960.js"];
    css9 = [];
  }
});

// .svelte-kit/output/server/entries/pages/blog/my-new-site.md.js
var my_new_site_md_exports = {};
__export(my_new_site_md_exports, {
  default: () => My_new_site,
  metadata: () => metadata2
});
var _ImagesLighthouseJpeg, metadata2, My_new_site;
var init_my_new_site_md = __esm({
  ".svelte-kit/output/server/entries/pages/blog/my-new-site.md.js"() {
    init_index_829c628b();
    init_blog_2d1088ef();
    _ImagesLighthouseJpeg = "/_app/immutable/assets/lighthouse-d2ab3b0f.jpeg";
    metadata2 = {
      "title": "My New Site",
      "date": "07.03.22",
      "cover": "my-new-site.jpeg",
      "snippet": "If you're reading this, you are already on my new site. I'd have a quick look around and see what sort of things I have done with it.",
      "tags": ["svelte", "web", "portfolio"]
    };
    My_new_site = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Blog2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata2), {}, {
        default: () => {
          return `<p>If you\u2019re reading this, you are already on my new site. I\u2019d have a quick look around and see what sort of things I have done with it.</p>
<h2>Svelte</h2>
<p>I chose to use <a href="${"https://svelte.dev"}" rel="${"nofollow"}">Svelte</a> which, was recently picked up by <a href="${"https://vercel.com"}" rel="${"nofollow"}">Vercel</a>, my reasons for choosing it was how well svelte it is, the files are sleek with your styles, scripts and, template all living within a <code>.svelte</code> file which makes for incredibly streamlined components that are quick to manage.</p>
<p>A benefit of Svelte is that it compiles down to HTML, CSS, and JS during the build step, which means there is no client-side rendering, resulting in an incredibly performant app-like feeling on all websites.</p>
<h2>Tailwind CSS</h2>
<p>I learned about Tailwind a few years back. I chose it due to the simple theming within the <code>tailwind.config.js</code> file. I also enjoy how quickly you can prototype new components. Despite some people claiming that it results in messy code, I found the development speed worthwhile.</p>
<h2>Markdown</h2>
<p>Thanks to the lovely <a href="${"https://mdsvex.pngwn.io"}" rel="${"nofollow"}">mdsvex</a> package, writing posts and project pages within Markdown is dreamlike. Those familiar with <a href="${"https://www.markdownguide.org/basic-syntax/"}" rel="${"nofollow"}">Markdown</a> know how convenient it is to write with, mdsvex takes minimal setup, it also allows custom layouts nested within your main page.</p>
<h2>Google Lighthouse Scores</h2>
<p>Here is a little screenshot detailing how this website scores on Lighthouse, Google\u2019s website page quality tool.</p>
<p><img${add_attribute("src", _ImagesLighthouseJpeg, 0)} alt="${"Lighthouse Scores"}"></p>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/5.js
var __exports9 = {};
__export(__exports9, {
  css: () => css10,
  entry: () => entry9,
  index: () => index9,
  js: () => js9,
  module: () => my_new_site_md_exports
});
var index9, entry9, js9, css10;
var init__9 = __esm({
  ".svelte-kit/output/server/nodes/5.js"() {
    init_my_new_site_md();
    index9 = 5;
    entry9 = "pages/blog/my-new-site.md-777ddd5f.js";
    js9 = ["pages/blog/my-new-site.md-777ddd5f.js", "chunks/index-db76da04.js", "chunks/_blog-b91c5960.js"];
    css10 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/index.svelte.js
var index_svelte_exports4 = {};
__export(index_svelte_exports4, {
  default: () => Abrasion,
  load: () => load5
});
var Document, Document_list, load5, Abrasion;
var init_index_svelte4 = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/index.svelte.js"() {
    init_index_829c628b();
    Document = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { title, path } = $$props;
      if ($$props.title === void 0 && $$bindings.title && title !== void 0)
        $$bindings.title(title);
      if ($$props.path === void 0 && $$bindings.path && path !== void 0)
        $$bindings.path(path);
      return `<a${add_attribute("href", path, 0)} class="${"flex items-center w-5/6 my-4 shadow-sm rounded-2xl lg:w-1/2 md:w-4/6"}"><div class="${"p-4"}"><h2 class="${"text-xl font-semibold"}">${escape(title)}</h2>
    <button class="${"link"}">Read</button></div></a>`;
    });
    Document_list = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { documents } = $$props;
      if ($$props.documents === void 0 && $$bindings.documents && documents !== void 0)
        $$bindings.documents(documents);
      return `<div class="${"flex flex-col items-center"}">${each(documents, (document) => {
        return `${validate_component(Document, "Document").$$render($$result, Object.assign(document.meta, { path: document.path }), {}, {})}`;
      })}</div>`;
    });
    load5 = async ({ fetch: fetch3 }) => {
      const documents = await fetch3("/api/abrasion.json");
      const allDocuments = await documents.json();
      return { props: { documents: allDocuments } };
    };
    Abrasion = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { documents } = $$props;
      if ($$props.documents === void 0 && $$bindings.documents && documents !== void 0)
        $$bindings.documents(documents);
      return `${$$result.head += `${$$result.title = `<title>Abrasion | Mac</title>`, ""}`, ""}
<div class="${"container flex-col py-6"}"><h1 class="${"mb-4 title"}">Abrasion</h1>
  <p class="${"max-w-lg my-4 text-center"}">Abrasion is an upcoming Action Platform game I am working on, you can read
    my design documentation and keep up to date with the progress by clicking
    the button below.
  </p>
  <button class="${"primary"}">Game Design Documents
  </button>
  ${validate_component(Document_list, "DocumentList").$$render($$result, { documents }, {}, {})}</div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/21.js
var __exports10 = {};
__export(__exports10, {
  css: () => css11,
  entry: () => entry10,
  index: () => index10,
  js: () => js10,
  module: () => index_svelte_exports4
});
var index10, entry10, js10, css11;
var init__10 = __esm({
  ".svelte-kit/output/server/nodes/21.js"() {
    init_index_svelte4();
    index10 = 21;
    entry10 = "pages/projects/abrasion/index.svelte-4e026b5c.js";
    js10 = ["pages/projects/abrasion/index.svelte-4e026b5c.js", "chunks/index-db76da04.js"];
    css11 = [];
  }
});

// .svelte-kit/output/server/chunks/_document-e416f241.js
var Document2;
var init_document_e416f241 = __esm({
  ".svelte-kit/output/server/chunks/_document-e416f241.js"() {
    init_index_829c628b();
    Document2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { title = "Abrasion | Mac" } = $$props;
      if ($$props.title === void 0 && $$bindings.title && title !== void 0)
        $$bindings.title(title);
      return `${$$result.head += `${$$result.title = `<title>${escape(title)} | Mac</title>`, ""}<meta property="${"og:type"}" content="${"article"}" data-svelte="svelte-zsw1bw"><meta property="${"og:article:section"}" content="${"Project"}" data-svelte="svelte-zsw1bw"><meta property="${"og:article:author:first_name"}" content="${"Mac"}" data-svelte="svelte-zsw1bw"><meta property="${"og:article:author:username"}" content="${"Mac9"}" data-svelte="svelte-zsw1bw"><meta property="${"og:article:author:gender"}" content="${"Male"}" data-svelte="svelte-zsw1bw">`, ""}
<article class="${"relative flex flex-col items-center p-4 mx-auto prose max-w-prose"}"><a href="${"/projects/abrasion/Index"}" class="${"absolute top-0 left-0 py-1 pl-3 cursor-pointer"}"><svg class="${"w-6 h-6"}" fill="${"none"}" stroke="${"currentColor"}" viewBox="${"0 0 24 24"}" xmlns="${"http://www.w3.org/2000/svg"}"><path stroke-linecap="${"round"}" stroke-linejoin="${"round"}" stroke-width="${"2"}" d="${"M10 19l-7-7m0 0l7-7m-7 7h18"}"></path></svg></a>
  <section id="${"header"}" class="${"flex flex-col items-start justify-start md:p-4"}"><h1 class="${"m-0"}">${escape(title)}</h1></section>
  <section class="${"prose"}">${slots.default ? slots.default({}) : ``}</section></article>`;
    });
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Animation.md.js
var Animation_md_exports = {};
__export(Animation_md_exports, {
  default: () => Animation,
  metadata: () => metadata3
});
var metadata3, Animation;
var init_Animation_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Animation.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata3 = {
      "title": "Animation",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Animation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata3), {}, {
        default: () => {
          return `<h2>Required Animations</h2>
<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Character<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Run</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Jump</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Grapple</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Attack</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Hurt</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Death</li></ul></li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Enemies<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Run</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Jump</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Grapple</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Attack</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Hurt</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Death</li></ul></li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Platform<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Flowers</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Bushes</li></ul></li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> User interface<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Tooth crumble</li></ul></li></ul>
<blockquote><p>[!NOTE] Skeleton animation
Thanks to Unity 2D\u2019s animation tools, it may be possible to create one animation skeleton for all similar sized sprites and have them use the same animations, useful for each class of enemy in each zone.</p></blockquote>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/8.js
var __exports11 = {};
__export(__exports11, {
  css: () => css12,
  entry: () => entry11,
  index: () => index11,
  js: () => js11,
  module: () => Animation_md_exports
});
var index11, entry11, js11, css12;
var init__11 = __esm({
  ".svelte-kit/output/server/nodes/8.js"() {
    init_Animation_md();
    index11 = 8;
    entry11 = "pages/projects/abrasion/Animation.md-d57d9336.js";
    js11 = ["pages/projects/abrasion/Animation.md-d57d9336.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css12 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Art Assets.md.js
var Art_Assets_md_exports = {};
__export(Art_Assets_md_exports, {
  default: () => Artu20Assets,
  metadata: () => metadata4
});
var metadata4, Artu20Assets;
var init_Art_Assets_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Art Assets.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata4 = {
      "title": "Art Assets",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Artu20Assets = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata4), {}, {
        default: () => {
          return `<h2>Look &amp; Feel</h2>
<p>The games art should draw inspiration from Disney cartoons, with exaggerated features and a cutesy style. The backgrounds should feel expansive and though they hold endless exploration.</p>
<hr>
<h2>Color Scheme</h2>
<p>Find a good selection of colors to use when creating art assets for the game.</p>
<hr>
<h2>Mood Boards</h2>
<p>Create at least one mood board for each character, including all bosses.</p>
<h2>Assets Needed</h2>
<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Dens</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Rooms</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Enemy minions</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Bosses</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Teeth for health</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Mirrors</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Menu decorations</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Level Props</li></ul>
<blockquote><p>[!QUESTION] Bush destruction?
Possibly a good idea to add an incentive not to destroy bushes? Such as when you do an enemy pops out.</p></blockquote>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/9.js
var __exports12 = {};
__export(__exports12, {
  css: () => css13,
  entry: () => entry12,
  index: () => index12,
  js: () => js12,
  module: () => Art_Assets_md_exports
});
var index12, entry12, js12, css13;
var init__12 = __esm({
  ".svelte-kit/output/server/nodes/9.js"() {
    init_Art_Assets_md();
    index12 = 9;
    entry12 = "pages/projects/abrasion/Art Assets.md-996d0c58.js";
    js12 = ["pages/projects/abrasion/Art Assets.md-996d0c58.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css13 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Combat.md.js
var Combat_md_exports = {};
__export(Combat_md_exports, {
  default: () => Combat,
  metadata: () => metadata5
});
var metadata5, Combat;
var init_Combat_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Combat.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata5 = {
      "title": "Combat",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Combat = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata5), {}, {
        default: () => {
          return `<h2>Details</h2>
<p>Combat should feel rewarding and easy to learn, by limiting the character to just 2 types of attacks it stops the player having to learn all manner of button combinations.</p>
<hr>
<h2>Attacks</h2>
<p><em>Dens</em> will be able to perform two types of attack, a melee attack using his toothbrush and a grappling hook attack which will do a smaller amount of damage and move the enemy closer to him.</p>
<hr>
<h2>Enemies</h2>
<p>Enemies should have a variety of ranged and melee attacks, minions should take between 2 and hits to remove from the game dependant on strength and the players items.</p>
<p>Each zone should have 3 classes of enemy:</p>
<ul><li>Ranged</li>
<li>Slow and Strong</li>
<li>Small and Quick</li></ul>
<hr>
<h2>Bosses</h2>
<p>Below is a list of each boss and the zone they will be in. Each boss should fit the zone they belong to in some way, i.e. the grass zone one could use honey to create sweets while the lava zone will have a baker making baked goods.</p>
<h3>Grass Zone</h3>
<h3>Water Zone</h3>
<h3>Cave Zone</h3>
<h3>Ice Zone</h3>
<p>An ice cream maker.</p>
<h3>Lava Zone</h3>
<h3>Solar Zone</h3>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/10.js
var __exports13 = {};
__export(__exports13, {
  css: () => css14,
  entry: () => entry13,
  index: () => index13,
  js: () => js13,
  module: () => Combat_md_exports
});
var index13, entry13, js13, css14;
var init__13 = __esm({
  ".svelte-kit/output/server/nodes/10.js"() {
    init_Combat_md();
    index13 = 10;
    entry13 = "pages/projects/abrasion/Combat.md-7412e416.js";
    js13 = ["pages/projects/abrasion/Combat.md-7412e416.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css14 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Funding.md.js
var Funding_md_exports = {};
__export(Funding_md_exports, {
  default: () => Funding,
  metadata: () => metadata6
});
var metadata6, Funding;
var init_Funding_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Funding.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata6 = {
      "title": "Funding",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Funding = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata6), {}, {
        default: () => {
          return `<h2>Kickstarter</h2>
<p>I plan to run a kickstarter once most of the game is complete, this will help me to achieve stretch goals and backlog items that otherwise may not make it into the game. The reason I will be able to do this is the funding will provide evidence that people would like to play the game.</p>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/11.js
var __exports14 = {};
__export(__exports14, {
  css: () => css15,
  entry: () => entry14,
  index: () => index14,
  js: () => js14,
  module: () => Funding_md_exports
});
var index14, entry14, js14, css15;
var init__14 = __esm({
  ".svelte-kit/output/server/nodes/11.js"() {
    init_Funding_md();
    index14 = 11;
    entry14 = "pages/projects/abrasion/Funding.md-4dae1035.js";
    js14 = ["pages/projects/abrasion/Funding.md-4dae1035.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css15 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Index.md.js
var Index_md_exports = {};
__export(Index_md_exports, {
  default: () => Index,
  metadata: () => metadata7
});
var metadata7, Index;
var init_Index_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Index.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata7 = {
      "title": "Design Document",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Index = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata7), {}, {
        default: () => {
          return `<h2>App Info</h2>
<p><strong>Tentative Title</strong>: Abrasion.</p>
<p><strong>Type</strong>: Video Game.</p>
<p><strong>Available on</strong>: Mobile, Console, Desktop.</p>
<p><strong>Development Start</strong>: 01.06.2022</p>
<hr>
<h2>Pitch</h2>
<p>In this game users will take on the role of <em>Dens</em> a tooth trying to get back to his mouth after having to be removed due to eating too many sweets and cakes. On his way home he patches himself up with fillings and toothpaste while fighting his way through the minions of various sweet treat manufacturers utilising his trusty toothbrush and swinging from platform to platform with his floss.</p>
<p><strong>Target Audience</strong>:</p>
<ul><li>Gamers of all ages.</li></ul>
<hr>
<h2>Concept Sketch</h2>
<p>(WIP).</p>
<hr>
<h2>Features</h2>
<ul><li>Tight, skill rewarding platform controls.</li>
<li>Large, open interconnected map with gated areas.</li>
<li>Fast paced quick combat.</li>
<li>Visual animations and sprite changes.</li>
<li>Clean readable user interface.</li>
<li>4-6 Zones: Grass, Water, Cave, Ice, Lava and Solar.</li>
<li>Bonus reverse time travel zone with noir theme.</li></ul>
<hr>
<h2>Accessibility</h2>
<ul><li>Assist settings to slow down, enable extra dashes and jumps so that people who are less into platform games can play.</li></ul>
<hr>
<h2>Timeline</h2>
<table><thead><tr><th></th>
<th>Milestone</th>
<th>Date</th></tr></thead>
<tbody><tr><td>1</td>
<td><a href="${"Tight%20Controls"}">Tight Controls</a></td>
<td>01.06.22</td></tr>
<tr><td>2</td>
<td><a href="${"User%20Interface"}">User Interface</a></td>
<td>02.06.22</td></tr>
<tr><td>3</td>
<td><a href="${"Combat"}">Combat</a></td>
<td>04.06.22</td></tr>
<tr><td>4</td>
<td><a href="${"Shop"}">Shop</a></td>
<td>06.06.22</td></tr>
<tr><td>5</td>
<td><a href="${"Map%20Outline"}">Map Outline</a></td>
<td>08.08.22</td></tr>
<tr><td>6</td>
<td><a href="${"Art%20Assets"}">Art Assets</a></td>
<td>12.08.22</td></tr>
<tr><td>7</td>
<td><a href="${"Animation"}">Animation</a></td>
<td>14.08.22</td></tr>
<tr><td>8</td>
<td><a href="${"Sound%20Effects"}">Sound Effects</a></td>
<td>18.08.22</td></tr>
<tr><td>9</td>
<td><a href="${"Soundtrack"}">Soundtrack</a></td>
<td>31.08.22</td></tr>
<tr><td>10</td>
<td><a href="${"Polishing"}">Polishing</a></td>
<td>Release</td></tr>
<tr><td>11</td>
<td><a href="${"Funding"}">Funding</a></td>
<td>Release</td></tr>
<tr><td>12</td>
<td><a href="${"Publish"}">Publish</a></td>
<td>Estimate: 31.09</td></tr></tbody></table>
<hr>
<h2>Backlog Features</h2>
<p>To be completed if I find time, or if funding goes well and people want these features. Possible to add as a future release.</p>
<ul><li>2 Extra playable characters. Incy and Cane.</li>
<li>Mobile release.</li></ul>
<hr>
<h2>External Links</h2>
<h3>Sources</h3>
<p><a href="${"https://brackeys.com"}" rel="${"nofollow"}">Brackeys</a></p>
<p><a href="${"https://pressstart.vip"}" rel="${"nofollow"}">Press Start</a></p>
<p><a href="${"https://www.youtube.com/c/Tarodev/about"}" rel="${"nofollow"}">Tarodev</a></p>
<p><a href="${"https://www.youtube.com/c/JonasTyroller"}" rel="${"nofollow"}">Jonas Tryoller</a></p>
<p><a href="${"https://www.youtube.com/watch?v=LAzaateh9q4&list=WL&index=15&t=2s"}" rel="${"nofollow"}">Thomas Brush</a></p>
<p><a href="${"https://www.youtube.com/watch?v=yLd5wmBNCBM"}" rel="${"nofollow"}">Noodle</a></p>
<h3>Inspirations</h3>
<p><a href="${"http://www.celestegame.com"}" rel="${"nofollow"}">Celeste for Movement</a></p>
<p><a href="${"https://www.hollowknight.com"}" rel="${"nofollow"}">Hollow Knight for Combat</a></p>
<p><a href="${"http://www.cupheadgame.com"}" rel="${"nofollow"}">Cuphead for Art-style</a></p>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/12.js
var __exports15 = {};
__export(__exports15, {
  css: () => css16,
  entry: () => entry15,
  index: () => index15,
  js: () => js15,
  module: () => Index_md_exports
});
var index15, entry15, js15, css16;
var init__15 = __esm({
  ".svelte-kit/output/server/nodes/12.js"() {
    init_Index_md();
    index15 = 12;
    entry15 = "pages/projects/abrasion/Index.md-1897e7be.js";
    js15 = ["pages/projects/abrasion/Index.md-1897e7be.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css16 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Map Outline.md.js
var Map_Outline_md_exports = {};
__export(Map_Outline_md_exports, {
  default: () => Mapu20Outline,
  metadata: () => metadata8
});
var metadata8, Mapu20Outline;
var init_Map_Outline_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Map Outline.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata8 = {
      "title": "Map",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Mapu20Outline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata8), {}, {
        default: () => {
          return `<h2>Details</h2>
<p>Abrasion will feature a large interconnected map akin to games like Hollow Knight, this design favours exploration and conveys a sense of progression by locking areas until the player has found skills or items that will help them through that obstacle. This is a very rewarding system.</p>
<hr>
<h2>Outline</h2>
<p>To start with I will create an outline of the map, with each room connected by a door, slope or tunnel system. I will also add icons displaying key areas and items such as boss fights and skills that will help the player through a section.</p>
<blockquote><p>[!NOTE]
I will add the outline below upon completion.</p></blockquote>
<hr>
<h1>Key Points</h1>
<p>I need to ensure that the player is guided invisibly through the levels, for example if a player has just found an item to help them through an obstacle the path should naturally lead them back in that direction. A good timeline is key to a fun progression throughout the game.</p>
<p>It is important to ensure that all rooms feel unique and more importantly that each zone feels very different from the last.</p>
<p>The terrain should blend nicely between sections, for example if you have a tunnel system going from the cave section to the lava section, reflect this in the environment with more cracks in the rocks and heat lines starting to show. You can also do this from a water section to a grass section showing the ground getting wetter.</p>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/13.js
var __exports16 = {};
__export(__exports16, {
  css: () => css17,
  entry: () => entry16,
  index: () => index16,
  js: () => js16,
  module: () => Map_Outline_md_exports
});
var index16, entry16, js16, css17;
var init__16 = __esm({
  ".svelte-kit/output/server/nodes/13.js"() {
    init_Map_Outline_md();
    index16 = 13;
    entry16 = "pages/projects/abrasion/Map Outline.md-0ad2c84c.js";
    js16 = ["pages/projects/abrasion/Map Outline.md-0ad2c84c.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css17 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Polishing.md.js
var Polishing_md_exports = {};
__export(Polishing_md_exports, {
  default: () => Polishing,
  metadata: () => metadata9
});
var metadata9, Polishing;
var init_Polishing_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Polishing.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata9 = {
      "title": "Polishing",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Polishing = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata9), {}, {
        default: () => {
          return `<h2>To polish</h2>
<p>I will add items to a list in this document as I need to, this section is for features that are complete however could be better with minor fixes and tuning.</p>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/14.js
var __exports17 = {};
__export(__exports17, {
  css: () => css18,
  entry: () => entry17,
  index: () => index17,
  js: () => js17,
  module: () => Polishing_md_exports
});
var index17, entry17, js17, css18;
var init__17 = __esm({
  ".svelte-kit/output/server/nodes/14.js"() {
    init_Polishing_md();
    index17 = 14;
    entry17 = "pages/projects/abrasion/Polishing.md-ed23076e.js";
    js17 = ["pages/projects/abrasion/Polishing.md-ed23076e.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css18 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Publish.md.js
var Publish_md_exports = {};
__export(Publish_md_exports, {
  default: () => Publish,
  metadata: () => metadata10
});
var metadata10, Publish;
var init_Publish_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Publish.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata10 = {
      "title": "Publishing",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Publish = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata10), {}, {
        default: () => {
          return `<h2>Platforms</h2>
<p>I plan to release this game on as many devices as possible. Starting with consoles and PC, which as the game is a 2D platformer should mean it will run on most if not all modern gaming consoles and PC\u2019s, the game should also be released for macOS as it should include as many players as possible.</p>
<p>I would also like to release for mobile devices like phones and tablets, this will increase my target audience by a lot, the reason this is a separate goal from the standard release is incase I run into any issues with the playability or performance of the game on mobile devices.</p>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/15.js
var __exports18 = {};
__export(__exports18, {
  css: () => css19,
  entry: () => entry18,
  index: () => index18,
  js: () => js18,
  module: () => Publish_md_exports
});
var index18, entry18, js18, css19;
var init__18 = __esm({
  ".svelte-kit/output/server/nodes/15.js"() {
    init_Publish_md();
    index18 = 15;
    entry18 = "pages/projects/abrasion/Publish.md-c8bf1839.js";
    js18 = ["pages/projects/abrasion/Publish.md-c8bf1839.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css19 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Shop.md.js
var Shop_md_exports = {};
__export(Shop_md_exports, {
  default: () => Shop,
  metadata: () => metadata11
});
var metadata11, Shop;
var init_Shop_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Shop.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata11 = {
      "title": "Shop",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Shop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata11), {}, {
        default: () => {
          return `<h2>Upgrades</h2>
<p>In the shop the player should be able to buy upgrades that increase their damage, health and more.</p>
<blockquote><p>[!NOTE] Removing the shop?
I have considered removing the shop in favour of a discovery based upgrade system. I could run both at the same time, kind of like a Zelda game. Allowing the player to purchase health and damage upgrades, yet discovering more ability based upgrades.</p></blockquote>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/16.js
var __exports19 = {};
__export(__exports19, {
  css: () => css20,
  entry: () => entry19,
  index: () => index19,
  js: () => js19,
  module: () => Shop_md_exports
});
var index19, entry19, js19, css20;
var init__19 = __esm({
  ".svelte-kit/output/server/nodes/16.js"() {
    init_Shop_md();
    index19 = 16;
    entry19 = "pages/projects/abrasion/Shop.md-e3a60bba.js";
    js19 = ["pages/projects/abrasion/Shop.md-e3a60bba.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css20 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Sound Effects.md.js
var Sound_Effects_md_exports = {};
__export(Sound_Effects_md_exports, {
  default: () => Soundu20Effects,
  metadata: () => metadata12
});
var metadata12, Soundu20Effects;
var init_Sound_Effects_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Sound Effects.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata12 = {
      "title": "Sound Effects",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Soundu20Effects = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata12), {}, {
        default: () => {
          return `<h2>Feel</h2>
<p>Just like the animations, the sound effects should add to the classic cartoon vibe with fun noises on jumps, attacks and more.</p>
<hr>
<h2>Sounds Needed</h2>
<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Character<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Jump</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Dash</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Hurt</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Death</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Grapple</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Attack</li></ul></li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Enemies<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Attack</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Death</li></ul></li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Discovery<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Mirrors</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Upgrades</li></ul></li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> User interface<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Menu navigation<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Selection</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Navigate</li></ul></li></ul></li></ul>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/17.js
var __exports20 = {};
__export(__exports20, {
  css: () => css21,
  entry: () => entry20,
  index: () => index20,
  js: () => js20,
  module: () => Sound_Effects_md_exports
});
var index20, entry20, js20, css21;
var init__20 = __esm({
  ".svelte-kit/output/server/nodes/17.js"() {
    init_Sound_Effects_md();
    index20 = 17;
    entry20 = "pages/projects/abrasion/Sound Effects.md-0cbdcc3e.js";
    js20 = ["pages/projects/abrasion/Sound Effects.md-0cbdcc3e.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css21 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Soundtrack.md.js
var Soundtrack_md_exports = {};
__export(Soundtrack_md_exports, {
  default: () => Soundtrack,
  metadata: () => metadata13
});
var metadata13, Soundtrack;
var init_Soundtrack_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Soundtrack.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata13 = {
      "title": "Soundtrack",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Soundtrack = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata13), {}, {
        default: () => {
          return `<h2>Zones</h2>
<p>Each zone should have a unique ambient track that transitions into a combat track using adaptive music methods when the player attacks an enemy or vice versa.</p>
<p>There should also be transitional music from zone to zone, i.e. the music should transition from the grass soundtrack to the water soundtrack via an in between piece of music.</p>
<p>Each boss should also have its own music.</p>
<hr>
<h2>Required Songs</h2>
<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Ambient<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Grass</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Water</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Cave</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Ice</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Solar</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Noir</li></ul></li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Boss<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Grass</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Water</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Cave</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Ice</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Solar</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Noir</li></ul></li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Combat Music<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Regular</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Noir</li></ul></li></ul>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/18.js
var __exports21 = {};
__export(__exports21, {
  css: () => css22,
  entry: () => entry21,
  index: () => index21,
  js: () => js21,
  module: () => Soundtrack_md_exports
});
var index21, entry21, js21, css22;
var init__21 = __esm({
  ".svelte-kit/output/server/nodes/18.js"() {
    init_Soundtrack_md();
    index21 = 18;
    entry21 = "pages/projects/abrasion/Soundtrack.md-1a560e13.js";
    js21 = ["pages/projects/abrasion/Soundtrack.md-1a560e13.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css22 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/Tight Controls.md.js
var Tight_Controls_md_exports = {};
__export(Tight_Controls_md_exports, {
  default: () => Tightu20Controls,
  metadata: () => metadata14
});
var metadata14, Tightu20Controls;
var init_Tight_Controls_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/Tight Controls.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata14 = {
      "title": "Controls",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Tightu20Controls = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata14), {}, {
        default: () => {
          return `<h2>Details</h2>
<p>The game will feature proven platform game movement controls included in games like Celeste, these features include:</p>
<ul><li>Variable jump height</li>
<li>Apex modifiers</li>
<li>Jump buffering</li>
<li>Coyote time</li>
<li>Clamped fall speed</li>
<li>Edge detection</li></ul>
<hr>
<h2>Control Scheme</h2>
<ul class="${"contains-task-list"}"><li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Walk</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Jump</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Double Jump</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Dash</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Floss Grapple</li>
<li class="${"task-list-item"}"><input type="${"checkbox"}" disabled> Crouch</li></ul>
<p>These controls should feel perfect before even thinking about adding anything else to the game.</p>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/19.js
var __exports22 = {};
__export(__exports22, {
  css: () => css23,
  entry: () => entry22,
  index: () => index22,
  js: () => js22,
  module: () => Tight_Controls_md_exports
});
var index22, entry22, js22, css23;
var init__22 = __esm({
  ".svelte-kit/output/server/nodes/19.js"() {
    init_Tight_Controls_md();
    index22 = 19;
    entry22 = "pages/projects/abrasion/Tight Controls.md-923cee32.js";
    js22 = ["pages/projects/abrasion/Tight Controls.md-923cee32.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css23 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/abrasion/User Interface.md.js
var User_Interface_md_exports = {};
__export(User_Interface_md_exports, {
  default: () => Useru20Interface,
  metadata: () => metadata15
});
var metadata15, Useru20Interface;
var init_User_Interface_md = __esm({
  ".svelte-kit/output/server/entries/pages/projects/abrasion/User Interface.md.js"() {
    init_index_829c628b();
    init_document_e416f241();
    metadata15 = {
      "title": "User Interface",
      "tags": ["abrasion"],
      "layout": "document"
    };
    Useru20Interface = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Document2, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata15), {}, {
        default: () => {
          return `<h2>Health</h2>
<p>The health will be stored as teeth, starting the game with 3 teeth. Upon taking a hit the tooth will crumble and fall out of the container, leaving an outline in its place. I have chosen this method over a health bar as it gives the player immediate feedback on how much damage they can take.</p>
<hr>
<h2>Mirrors</h2>
<p>Mirrors are a collectible currency and will be displayed as an integer with an icon next to them. This should be hidden unless you pick up some mirrors or are in a shop.</p>
<blockquote><p>Note: I may consider removing the Mirrors system in favour of a purely discovery based upgrade system.</p></blockquote>
<hr>
<h2>Map</h2>
<p>The user will be able to press the <kbd>Select</kbd> or <kbd>Tab</kbd> button to bring up a map of the game, displaying sections they have previously visited. I considered adding a minmap in the top right similar to Hollow Knight however I prefer the more cinematic views with a very minimal user interface as seen in Ori.</p>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/20.js
var __exports23 = {};
__export(__exports23, {
  css: () => css24,
  entry: () => entry23,
  index: () => index23,
  js: () => js23,
  module: () => User_Interface_md_exports
});
var index23, entry23, js23, css24;
var init__23 = __esm({
  ".svelte-kit/output/server/nodes/20.js"() {
    init_User_Interface_md();
    index23 = 20;
    entry23 = "pages/projects/abrasion/User Interface.md-f2ac21e4.js";
    js23 = ["pages/projects/abrasion/User Interface.md-f2ac21e4.js", "chunks/index-db76da04.js", "chunks/_document-9de51a6d.js"];
    css24 = [];
  }
});

// .svelte-kit/output/server/entries/endpoints/api/projects.json.js
var projects_json_exports = {};
__export(projects_json_exports, {
  get: () => get
});
var get;
var init_projects_json = __esm({
  ".svelte-kit/output/server/entries/endpoints/api/projects.json.js"() {
    get = async () => {
      const allProjectFiles = {};
      const iterableProjectFiles = Object.entries(allProjectFiles);
      const allProjects = await Promise.all(iterableProjectFiles.map(async ([path, resolver]) => {
        const { metadata: metadata16 } = await resolver();
        const projectPath = path.slice(2, -3);
        return {
          meta: metadata16,
          path: projectPath
        };
      }));
      const sortedProjects = allProjects.sort((a, b) => {
        return new Date(b.meta.date) - new Date(a.meta.date);
      });
      return {
        body: sortedProjects
      };
    };
  }
});

// .svelte-kit/output/server/entries/endpoints/api/blog.json.js
var blog_json_exports = {};
__export(blog_json_exports, {
  get: () => get2
});
var get2;
var init_blog_json = __esm({
  ".svelte-kit/output/server/entries/endpoints/api/blog.json.js"() {
    get2 = async () => {
      const allPostFiles = { "../blog/ipad-for-programming.md": () => Promise.resolve().then(() => (init_ipad_for_programming_md(), ipad_for_programming_md_exports)), "../blog/my-new-site.md": () => Promise.resolve().then(() => (init_my_new_site_md(), my_new_site_md_exports)) };
      const iterablePostFiles = Object.entries(allPostFiles);
      const allPosts = await Promise.all(iterablePostFiles.map(async ([path, resolver]) => {
        const { metadata: metadata16 } = await resolver();
        const postPath = path.slice(2, -3);
        return {
          meta: metadata16,
          path: postPath
        };
      }));
      const sortedPosts = allPosts.sort((a, b) => {
        return new Date(b.meta.date) - new Date(a.meta.date);
      });
      return {
        body: sortedPosts
      };
    };
  }
});

// .svelte-kit/output/server/entries/endpoints/api/abrasion.json.js
var abrasion_json_exports = {};
__export(abrasion_json_exports, {
  get: () => get3
});
var get3;
var init_abrasion_json = __esm({
  ".svelte-kit/output/server/entries/endpoints/api/abrasion.json.js"() {
    get3 = async () => {
      const allAbrasionFiles = { "../projects/abrasion/Animation.md": () => Promise.resolve().then(() => (init_Animation_md(), Animation_md_exports)), "../projects/abrasion/Art Assets.md": () => Promise.resolve().then(() => (init_Art_Assets_md(), Art_Assets_md_exports)), "../projects/abrasion/Combat.md": () => Promise.resolve().then(() => (init_Combat_md(), Combat_md_exports)), "../projects/abrasion/Funding.md": () => Promise.resolve().then(() => (init_Funding_md(), Funding_md_exports)), "../projects/abrasion/Index.md": () => Promise.resolve().then(() => (init_Index_md(), Index_md_exports)), "../projects/abrasion/Map Outline.md": () => Promise.resolve().then(() => (init_Map_Outline_md(), Map_Outline_md_exports)), "../projects/abrasion/Polishing.md": () => Promise.resolve().then(() => (init_Polishing_md(), Polishing_md_exports)), "../projects/abrasion/Publish.md": () => Promise.resolve().then(() => (init_Publish_md(), Publish_md_exports)), "../projects/abrasion/Shop.md": () => Promise.resolve().then(() => (init_Shop_md(), Shop_md_exports)), "../projects/abrasion/Sound Effects.md": () => Promise.resolve().then(() => (init_Sound_Effects_md(), Sound_Effects_md_exports)), "../projects/abrasion/Soundtrack.md": () => Promise.resolve().then(() => (init_Soundtrack_md(), Soundtrack_md_exports)), "../projects/abrasion/Tight Controls.md": () => Promise.resolve().then(() => (init_Tight_Controls_md(), Tight_Controls_md_exports)), "../projects/abrasion/User Interface.md": () => Promise.resolve().then(() => (init_User_Interface_md(), User_Interface_md_exports)) };
      const iterableAbrasionFiles = Object.entries(allAbrasionFiles);
      const allAbrasions = await Promise.all(iterableAbrasionFiles.map(async ([path, resolver]) => {
        const { metadata: metadata16 } = await resolver();
        const AbrasionPath = path.slice(2, -3);
        return {
          meta: metadata16,
          path: AbrasionPath
        };
      }));
      return {
        body: allAbrasions
      };
    };
  }
});

// .svelte-kit/vercel-tmp/serverless.js
var serverless_exports = {};
__export(serverless_exports, {
  default: () => serverless_default
});
module.exports = __toCommonJS(serverless_exports);
init_polyfills();

// node_modules/@sveltejs/kit/dist/node.js
var import_stream = require("stream");
var setCookie = { exports: {} };
var defaultParseOptions = {
  decodeValues: true,
  map: false,
  silent: false
};
function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}
function parseString(setCookieValue, options) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString);
  var nameValue = parts.shift().split("=");
  var name = nameValue.shift();
  var value = nameValue.join("=");
  options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
  try {
    value = options.decodeValues ? decodeURIComponent(value) : value;
  } catch (e2) {
    console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e2);
  }
  var cookie = {
    name,
    value
  };
  parts.forEach(function(part) {
    var sides = part.split("=");
    var key2 = sides.shift().trimLeft().toLowerCase();
    var value2 = sides.join("=");
    if (key2 === "expires") {
      cookie.expires = new Date(value2);
    } else if (key2 === "max-age") {
      cookie.maxAge = parseInt(value2, 10);
    } else if (key2 === "secure") {
      cookie.secure = true;
    } else if (key2 === "httponly") {
      cookie.httpOnly = true;
    } else if (key2 === "samesite") {
      cookie.sameSite = value2;
    } else {
      cookie[key2] = value2;
    }
  });
  return cookie;
}
function parse(input, options) {
  options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
  if (!input) {
    if (!options.map) {
      return [];
    } else {
      return {};
    }
  }
  if (input.headers && input.headers["set-cookie"]) {
    input = input.headers["set-cookie"];
  } else if (input.headers) {
    var sch = input.headers[Object.keys(input.headers).find(function(key2) {
      return key2.toLowerCase() === "set-cookie";
    })];
    if (!sch && input.headers.cookie && !options.silent) {
      console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
    }
    input = sch;
  }
  if (!Array.isArray(input)) {
    input = [input];
  }
  options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
  if (!options.map) {
    return input.filter(isNonEmptyString).map(function(str) {
      return parseString(str, options);
    });
  } else {
    var cookies = {};
    return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
      var cookie = parseString(str, options);
      cookies2[cookie.name] = cookie;
      return cookies2;
    }, cookies);
  }
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;
  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }
  function notSpecialChar() {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  }
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
setCookie.exports = parse;
setCookie.exports.parse = parse;
setCookie.exports.parseString = parseString;
var splitCookiesString_1 = setCookie.exports.splitCookiesString = splitCookiesString;
function get_raw_body(req) {
  return new Promise((fulfil, reject) => {
    const h2 = req.headers;
    if (!h2["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h2["content-length"]);
    if (isNaN(length) && h2["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      fulfil(data);
    });
  });
}
async function getRequest(base2, req) {
  let headers = req.headers;
  if (req.httpVersionMajor === 2) {
    headers = Object.assign({}, headers);
    delete headers[":method"];
    delete headers[":path"];
    delete headers[":authority"];
    delete headers[":scheme"];
  }
  return new Request(base2 + req.url, {
    method: req.method,
    headers,
    body: await get_raw_body(req)
  });
}
async function setResponse(res, response) {
  const headers = Object.fromEntries(response.headers);
  if (response.headers.has("set-cookie")) {
    const header = response.headers.get("set-cookie");
    const split = splitCookiesString_1(header);
    headers["set-cookie"] = split;
  }
  res.writeHead(response.status, headers);
  if (response.body instanceof import_stream.Readable) {
    response.body.pipe(res);
  } else {
    if (response.body) {
      res.write(new Uint8Array(await response.arrayBuffer()));
    }
    res.end();
  }
}

// .svelte-kit/output/server/index.js
init_index_829c628b();
var __defProp2 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp2(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function afterUpdate() {
}
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  {
    stores.page.set(page2);
  }
  return `


${components[1] ? `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => {
      return `${components[2] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
        default: () => {
          return `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}`;
        }
      })}` : `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`;
    }
  })}` : `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {})}`}

${``}`;
});
function to_headers(object) {
  const headers = new Headers();
  if (object) {
    for (const key2 in object) {
      const value = object[key2];
      if (!value)
        continue;
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          headers.append(key2, value2);
        });
      } else {
        headers.set(key2, value);
      }
    }
  }
  return headers;
}
function hash(value) {
  let hash2 = 5381;
  let i2 = value.length;
  if (typeof value === "string") {
    while (i2)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i2);
  } else {
    while (i2)
      hash2 = hash2 * 33 ^ value[--i2];
  }
  return (hash2 >>> 0).toString(36);
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key2 in obj) {
    clone2[key2.toLowerCase()] = obj[key2];
  }
  return clone2;
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = params[key2].replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
  }
  return params;
}
function is_pojo(body) {
  if (typeof body !== "object")
    return false;
  if (body) {
    if (body instanceof Uint8Array)
      return false;
    if (body._readableState && typeof body.pipe === "function")
      return false;
    if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
      return false;
  }
  return true;
}
function normalize_request_method(event) {
  const method = event.request.method.toLowerCase();
  return method === "delete" ? "del" : method;
}
function error(body) {
  return new Response(body, {
    status: 500
  });
}
function is_string(s22) {
  return typeof s22 === "string" || s22 instanceof String;
}
var text_types = /* @__PURE__ */ new Set([
  "application/xml",
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data"
]);
function is_text(content_type) {
  if (!content_type)
    return true;
  const type = content_type.split(";")[0].toLowerCase();
  return type.startsWith("text/") || type.endsWith("+xml") || text_types.has(type);
}
async function render_endpoint(event, mod) {
  const method = normalize_request_method(event);
  let handler = mod[method];
  if (!handler && method === "head") {
    handler = mod.get;
  }
  if (!handler) {
    const allowed = [];
    for (const method2 in ["get", "post", "put", "patch"]) {
      if (mod[method2])
        allowed.push(method2.toUpperCase());
    }
    if (mod.del)
      allowed.push("DELETE");
    if (mod.get || mod.head)
      allowed.push("HEAD");
    return event.request.headers.get("x-sveltekit-load") ? new Response(void 0, {
      status: 204
    }) : new Response(`${event.request.method} method not allowed`, {
      status: 405,
      headers: {
        allow: allowed.join(", ")
      }
    });
  }
  const response = await handler(event);
  const preface = `Invalid response from route ${event.url.pathname}`;
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  if (response.fallthrough) {
    throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
  }
  const { status = 200, body = {} } = response;
  const headers = response.headers instanceof Headers ? new Headers(response.headers) : to_headers(response.headers);
  const type = headers.get("content-type");
  if (!is_text(type) && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if (is_pojo(body) && (!type || type.startsWith("application/json"))) {
    headers.set("content-type", "application/json; charset=utf-8");
    normalized_body = JSON.stringify(body);
  } else {
    normalized_body = body;
  }
  if ((typeof normalized_body === "string" || normalized_body instanceof Uint8Array) && !headers.has("etag")) {
    const cache_control = headers.get("cache-control");
    if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
      headers.set("etag", `"${hash(normalized_body)}"`);
    }
  }
  return new Response(method !== "head" ? normalized_body : void 0, {
    status,
    headers
  });
}
var chars$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key2) {
            return walk(thing[key2]);
          });
      }
    }
  }
  walk(value);
  var names = /* @__PURE__ */ new Map();
  Array.from(counts).filter(function(entry24) {
    return entry24[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry24, i2) {
    names.set(entry24[0], getName(i2));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i2) {
          return i2 in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key2) {
          return safeKey(key2) + ":" + stringify(thing[key2]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i2) {
            statements_1.push(name + "[" + i2 + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key2) {
            statements_1.push("" + name + safeProp(key2) + "=" + stringify(thing[key2]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars$1[num % chars$1.length] + name;
    num = ~~(num / chars$1.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped2[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escapeUnsafeChars(JSON.stringify(key2));
}
function safeProp(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? "." + key2 : "[" + escapeUnsafeChars(JSON.stringify(key2)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i2 = 0; i2 < str.length; i2 += 1) {
    var char = str.charAt(i2);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped2) {
      result += escaped2[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i2 + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i2];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop3() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop3) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop3) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop3;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
var render_json_payload_script_dict = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var render_json_payload_script_regex = new RegExp(`[${Object.keys(render_json_payload_script_dict).join("")}]`, "g");
function render_json_payload_script(attrs, payload) {
  const safe_payload = JSON.stringify(payload).replace(render_json_payload_script_regex, (match) => render_json_payload_script_dict[match]);
  let safe_attrs = "";
  for (const [key2, value] of Object.entries(attrs)) {
    if (value === void 0)
      continue;
    safe_attrs += ` sveltekit:data-${key2}=${escape_html_attr(value)}`;
  }
  return `<script type="application/json"${safe_attrs}>${safe_payload}<\/script>`;
}
var escape_html_attr_dict = {
  "&": "&amp;",
  '"': "&quot;"
};
var escape_html_attr_regex = new RegExp(`[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`, "g");
function escape_html_attr(str) {
  const escaped_str = str.replace(escape_html_attr_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return escape_html_attr_dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return `"${escaped_str}"`;
}
var s2 = JSON.stringify;
function create_prerendering_url_proxy(url) {
  return new Proxy(url, {
    get: (target, prop, receiver) => {
      if (prop === "search" || prop === "searchParams") {
        throw new Error(`Cannot access url.${prop} on a page with prerendering enabled`);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
var encoder = new TextEncoder();
function sha256(data) {
  if (!key[0])
    precompute();
  const out = init.slice(0);
  const array2 = encode$1(data);
  for (let i2 = 0; i2 < array2.length; i2 += 16) {
    const w = array2.subarray(i2, i2 + 16);
    let tmp;
    let a;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i22 = 0; i22 < 64; i22++) {
      if (i22 < 16) {
        tmp = w[i22];
      } else {
        a = w[i22 + 1 & 15];
        b = w[i22 + 14 & 15];
        tmp = w[i22 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i22 & 15] + w[i22 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i22];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return base64(bytes);
}
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x2) {
    return (x2 - Math.floor(x2)) * 4294967296;
  }
  let prime = 2;
  for (let i2 = 0; i2 < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i2 < 8) {
        init[i2] = frac(prime ** (1 / 2));
      }
      key[i2] = frac(prime ** (1 / 3));
      i2++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i2 = 0; i2 < bytes.length; i2 += 4) {
    const a = bytes[i2 + 0];
    const b = bytes[i2 + 1];
    const c = bytes[i2 + 2];
    const d = bytes[i2 + 3];
    bytes[i2 + 0] = d;
    bytes[i2 + 1] = c;
    bytes[i2 + 2] = b;
    bytes[i2 + 3] = a;
  }
}
function encode$1(str) {
  const encoded = encoder.encode(str);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function base64(bytes) {
  const l = bytes.length;
  let result = "";
  let i2;
  for (i2 = 2; i2 < l; i2 += 3) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2 | bytes[i2] >> 6];
    result += chars[bytes[i2] & 63];
  }
  if (i2 === l + 1) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4];
    result += "==";
  }
  if (i2 === l) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
var csp_ready;
var array = new Uint8Array(16);
function generate_nonce() {
  crypto.getRandomValues(array);
  return base64(array);
}
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var Csp = class {
  #use_hashes;
  #dev;
  #script_needs_csp;
  #style_needs_csp;
  #directives;
  #script_src;
  #style_src;
  constructor({ mode, directives }, { dev, prerender, needs_nonce }) {
    this.#use_hashes = mode === "hash" || mode === "auto" && prerender;
    this.#directives = dev ? __spreadValues({}, directives) : directives;
    this.#dev = dev;
    const d = this.#directives;
    if (dev) {
      const effective_style_src2 = d["style-src"] || d["default-src"];
      if (effective_style_src2 && !effective_style_src2.includes("unsafe-inline")) {
        d["style-src"] = [...effective_style_src2, "unsafe-inline"];
      }
    }
    this.#script_src = [];
    this.#style_src = [];
    const effective_script_src = d["script-src"] || d["default-src"];
    const effective_style_src = d["style-src"] || d["default-src"];
    this.#script_needs_csp = !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0;
    this.#style_needs_csp = !dev && !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0;
    this.script_needs_nonce = this.#script_needs_csp && !this.#use_hashes;
    this.style_needs_nonce = this.#style_needs_csp && !this.#use_hashes;
    if (this.script_needs_nonce || this.style_needs_nonce || needs_nonce) {
      this.nonce = generate_nonce();
    }
  }
  add_script(content) {
    if (this.#script_needs_csp) {
      if (this.#use_hashes) {
        this.#script_src.push(`sha256-${sha256(content)}`);
      } else if (this.#script_src.length === 0) {
        this.#script_src.push(`nonce-${this.nonce}`);
      }
    }
  }
  add_style(content) {
    if (this.#style_needs_csp) {
      if (this.#use_hashes) {
        this.#style_src.push(`sha256-${sha256(content)}`);
      } else if (this.#style_src.length === 0) {
        this.#style_src.push(`nonce-${this.nonce}`);
      }
    }
  }
  get_header(is_meta = false) {
    const header = [];
    const directives = __spreadValues({}, this.#directives);
    if (this.#style_src.length > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...this.#style_src
      ];
    }
    if (this.#script_src.length > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...this.#script_src
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = directives[key2];
      if (!value)
        continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
  get_meta() {
    const content = escape_html_attr(this.get_header(true));
    return `<meta http-equiv="content-security-policy" content=${content}>`;
  }
};
var updated = __spreadProps(__spreadValues({}, readable(false)), {
  check: () => false
});
async function render_response({
  branch,
  options,
  state,
  $session,
  page_config,
  status,
  error: error2 = null,
  event,
  resolve_opts,
  stuff
}) {
  if (state.prerendering) {
    if (options.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options.template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
    }
  }
  const stylesheets = new Set(options.manifest._.entry.css);
  const modulepreloads = new Set(options.manifest._.entry.js);
  const styles = /* @__PURE__ */ new Map();
  const serialized_data = [];
  let shadow_props;
  let rendered;
  let is_private = false;
  let cache;
  if (error2) {
    error2.stack = options.get_stack(error2);
  }
  if (resolve_opts.ssr) {
    branch.forEach(({ node, props: props2, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => stylesheets.add(url));
      if (node.js)
        node.js.forEach((url) => modulepreloads.add(url));
      if (node.styles)
        Object.entries(node.styles).forEach(([k, v]) => styles.set(k, v));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (props2)
        shadow_props = props2;
      cache = loaded == null ? void 0 : loaded.cache;
      is_private = (cache == null ? void 0 : cache.private) ?? uses_credentials;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session: __spreadProps(__spreadValues({}, session), {
          subscribe: (fn) => {
            is_private = (cache == null ? void 0 : cache.private) ?? true;
            return session.subscribe(fn);
          }
        }),
        updated
      },
      page: {
        error: error2,
        params: event.params,
        routeId: event.routeId,
        status,
        stuff,
        url: state.prerendering ? create_prerendering_url_proxy(event.url) : event.url
      },
      components: branch.map(({ node }) => node.module.default)
    };
    const print_error = (property, replacement) => {
      Object.defineProperty(props.page, property, {
        get: () => {
          throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
        }
      });
    };
    print_error("origin", "origin");
    print_error("path", "pathname");
    print_error("query", "searchParams");
    for (let i2 = 0; i2 < branch.length; i2 += 1) {
      props[`props_${i2}`] = await branch[i2].loaded.props;
    }
    rendered = options.root.render(props);
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  let { head, html: body } = rendered;
  const inlined_style = Array.from(styles.values()).join("\n");
  await csp_ready;
  const csp = new Csp(options.csp, {
    dev: options.dev,
    prerender: !!state.prerendering,
    needs_nonce: options.template_contains_nonce
  });
  const target = hash(body);
  const init_app = `
		import { start } from ${s2(options.prefix + options.manifest._.entry.file)};
		start({
			target: document.querySelector('[data-sveltekit-hydrate="${target}"]').parentNode,
			paths: ${s2(options.paths)},
			session: ${try_serialize($session, (error3) => {
    throw new Error(`Failed to serialize session data: ${error3.message}`);
  })},
			route: ${!!page_config.router},
			spa: ${!resolve_opts.ssr},
			trailing_slash: ${s2(options.trailing_slash)},
			hydrate: ${resolve_opts.ssr && page_config.hydrate ? `{
				status: ${status},
				error: ${serialize_error(error2)},
				nodes: [${branch.map(({ node }) => node.index).join(", ")}],
				params: ${devalue(event.params)},
				routeId: ${s2(event.routeId)}
			}` : "null"}
		});
	`;
  const init_service_worker = `
		if ('serviceWorker' in navigator) {
			addEventListener('load', () => {
				navigator.serviceWorker.register('${options.service_worker}');
			});
		}
	`;
  if (inlined_style) {
    const attributes = [];
    if (options.dev)
      attributes.push(" data-sveltekit");
    if (csp.style_needs_nonce)
      attributes.push(` nonce="${csp.nonce}"`);
    csp.add_style(inlined_style);
    head += `
	<style${attributes.join("")}>${inlined_style}</style>`;
  }
  head += Array.from(stylesheets).map((dep) => {
    const attributes = [
      'rel="stylesheet"',
      `href="${options.prefix + dep}"`
    ];
    if (csp.style_needs_nonce) {
      attributes.push(`nonce="${csp.nonce}"`);
    }
    if (styles.has(dep)) {
      attributes.push("disabled", 'media="(max-width: 0)"');
    }
    return `
	<link ${attributes.join(" ")}>`;
  }).join("");
  if (page_config.router || page_config.hydrate) {
    head += Array.from(modulepreloads).map((dep) => `
	<link rel="modulepreload" href="${options.prefix + dep}">`).join("");
    const attributes = ['type="module"', `data-sveltekit-hydrate="${target}"`];
    csp.add_script(init_app);
    if (csp.script_needs_nonce) {
      attributes.push(`nonce="${csp.nonce}"`);
    }
    body += `
		<script ${attributes.join(" ")}>${init_app}<\/script>`;
    body += serialized_data.map(({ url, body: body2, response }) => render_json_payload_script({ type: "data", url, body: typeof body2 === "string" ? hash(body2) : void 0 }, response)).join("\n	");
    if (shadow_props) {
      body += render_json_payload_script({ type: "props" }, shadow_props);
    }
  }
  if (options.service_worker) {
    csp.add_script(init_service_worker);
    head += `
			<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_service_worker}<\/script>`;
  }
  if (state.prerendering) {
    const http_equiv = [];
    const csp_headers = csp.get_meta();
    if (csp_headers) {
      http_equiv.push(csp_headers);
    }
    if (cache) {
      http_equiv.push(`<meta http-equiv="cache-control" content="max-age=${cache.maxage}">`);
    }
    if (http_equiv.length > 0) {
      head = http_equiv.join("\n") + head;
    }
  }
  const segments = event.url.pathname.slice(options.paths.base.length).split("/").slice(2);
  const assets2 = options.paths.assets || (segments.length > 0 ? segments.map(() => "..").join("/") : ".");
  const html = await resolve_opts.transformPage({
    html: options.template({ head, body, assets: assets2, nonce: csp.nonce })
  });
  const headers = new Headers({
    "content-type": "text/html",
    etag: `"${hash(html)}"`
  });
  if (cache) {
    headers.set("cache-control", `${is_private ? "private" : "public"}, max-age=${cache.maxage}`);
  }
  if (!options.floc) {
    headers.set("permissions-policy", "interest-cohort=()");
  }
  if (!state.prerendering) {
    const csp_header = csp.get_header();
    if (csp_header) {
      headers.set("content-security-policy", csp_header);
    }
  }
  return new Response(html, {
    status,
    headers
  });
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize(__spreadProps(__spreadValues({}, error2), { name, message, stack }));
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
var parse_1 = parse$1;
var serialize_1 = serialize;
var __toString = Object.prototype.toString;
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  var obj = {};
  var opt = options || {};
  var dec = opt.decode || decode;
  var index24 = 0;
  while (index24 < str.length) {
    var eqIdx = str.indexOf("=", index24);
    if (eqIdx === -1) {
      break;
    }
    var endIdx = str.indexOf(";", index24);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index24 = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    var key2 = str.slice(index24, eqIdx).trim();
    if (obj[key2] === void 0) {
      var val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.charCodeAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key2] = tryDecode(val, dec);
    }
    index24 = endIdx + 1;
  }
  return obj;
}
function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  var value = enc(val);
  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError("argument val is invalid");
  }
  var str = name + "=" + value;
  if (opt.maxAge != null) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    var expires = opt.expires;
    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function decode(str) {
  return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
}
function encode(val) {
  return encodeURIComponent(val);
}
function isDate(val) {
  return __toString.call(val) === "[object Date]" || val instanceof Date;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch (e2) {
    return str;
  }
}
var setCookie2 = { exports: {} };
var defaultParseOptions2 = {
  decodeValues: true,
  map: false,
  silent: false
};
function isNonEmptyString2(str) {
  return typeof str === "string" && !!str.trim();
}
function parseString2(setCookieValue, options) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString2);
  var nameValue = parts.shift().split("=");
  var name = nameValue.shift();
  var value = nameValue.join("=");
  options = options ? Object.assign({}, defaultParseOptions2, options) : defaultParseOptions2;
  try {
    value = options.decodeValues ? decodeURIComponent(value) : value;
  } catch (e2) {
    console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e2);
  }
  var cookie = {
    name,
    value
  };
  parts.forEach(function(part) {
    var sides = part.split("=");
    var key2 = sides.shift().trimLeft().toLowerCase();
    var value2 = sides.join("=");
    if (key2 === "expires") {
      cookie.expires = new Date(value2);
    } else if (key2 === "max-age") {
      cookie.maxAge = parseInt(value2, 10);
    } else if (key2 === "secure") {
      cookie.secure = true;
    } else if (key2 === "httponly") {
      cookie.httpOnly = true;
    } else if (key2 === "samesite") {
      cookie.sameSite = value2;
    } else {
      cookie[key2] = value2;
    }
  });
  return cookie;
}
function parse2(input, options) {
  options = options ? Object.assign({}, defaultParseOptions2, options) : defaultParseOptions2;
  if (!input) {
    if (!options.map) {
      return [];
    } else {
      return {};
    }
  }
  if (input.headers && input.headers["set-cookie"]) {
    input = input.headers["set-cookie"];
  } else if (input.headers) {
    var sch = input.headers[Object.keys(input.headers).find(function(key2) {
      return key2.toLowerCase() === "set-cookie";
    })];
    if (!sch && input.headers.cookie && !options.silent) {
      console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
    }
    input = sch;
  }
  if (!Array.isArray(input)) {
    input = [input];
  }
  options = options ? Object.assign({}, defaultParseOptions2, options) : defaultParseOptions2;
  if (!options.map) {
    return input.filter(isNonEmptyString2).map(function(str) {
      return parseString2(str, options);
    });
  } else {
    var cookies = {};
    return input.filter(isNonEmptyString2).reduce(function(cookies2, str) {
      var cookie = parseString2(str, options);
      cookies2[cookie.name] = cookie;
      return cookies2;
    }, cookies);
  }
}
function splitCookiesString2(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;
  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }
  function notSpecialChar() {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  }
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
setCookie2.exports = parse2;
setCookie2.exports.parse = parse2;
var parseString_1 = setCookie2.exports.parseString = parseString2;
var splitCookiesString_12 = setCookie2.exports.splitCookiesString = splitCookiesString2;
function normalize(loaded) {
  if (loaded.fallthrough) {
    throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
  }
  if ("maxage" in loaded) {
    throw new Error("maxage should be replaced with cache: { maxage }");
  }
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return { status: status || 500, error: new Error() };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      throw new Error('"redirect" property returned from load() must be accompanied by a 3xx status code');
    }
    if (typeof loaded.redirect !== "string") {
      throw new Error('"redirect" property returned from load() must be a string');
    }
  }
  if (loaded.dependencies) {
    if (!Array.isArray(loaded.dependencies) || loaded.dependencies.some((dep) => typeof dep !== "string")) {
      throw new Error('"dependencies" property returned from load() must be of type string[]');
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
var absolute = /^([a-z]+:)?\/?\//;
var scheme = /^[a-z]+:/;
function resolve(base2, path) {
  if (scheme.test(path))
    return path;
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i2 = 0; i2 < pathparts.length; i2 += 1) {
    const part = pathparts[i2];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function is_root_relative(path) {
  return path[0] === "/" && path[1] !== "/";
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore")
    return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}
function domain_matches(hostname, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
  if (hostname === normalized)
    return true;
  return hostname.endsWith("." + normalized);
}
function path_matches(path, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
  if (path === normalized)
    return true;
  return path.startsWith(normalized + "/");
}
async function load_node({
  event,
  options,
  state,
  route,
  node,
  $session,
  stuff,
  is_error,
  is_leaf,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  const cookies = parse_1(event.request.headers.get("cookie") || "");
  const new_cookies = [];
  let loaded;
  const should_prerender = node.module.prerender ?? options.prerender.default;
  const shadow = is_leaf ? await load_shadow_data(route, event, options, should_prerender) : {};
  if (shadow.cookies) {
    shadow.cookies.forEach((header) => {
      new_cookies.push(parseString_1(header));
    });
  }
  if (shadow.error) {
    loaded = {
      status: shadow.status,
      error: shadow.error
    };
  } else if (shadow.redirect) {
    loaded = {
      status: shadow.status,
      redirect: shadow.redirect
    };
  } else if (module2.load) {
    const load_input = {
      url: state.prerendering ? create_prerendering_url_proxy(event.url) : event.url,
      params: event.params,
      props: shadow.body || {},
      routeId: event.routeId,
      get session() {
        if (node.module.prerender ?? options.prerender.default) {
          throw Error("Attempted to access session from a prerendered page. Session would never be populated.");
        }
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let requested;
        if (typeof resource === "string") {
          requested = resource;
        } else {
          requested = resource.url;
          opts = __spreadValues({
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity
          }, opts);
        }
        opts.headers = new Headers(opts.headers);
        for (const [key2, value] of event.request.headers) {
          if (key2 !== "authorization" && key2 !== "cookie" && key2 !== "host" && key2 !== "if-none-match" && !opts.headers.has(key2)) {
            opts.headers.set(key2, value);
          }
        }
        const resolved = resolve(event.url.pathname, requested.split("?")[0]);
        let response;
        let dependency;
        const prefix = options.paths.assets || options.paths.base;
        const filename = decodeURIComponent(resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = options.manifest.assets.has(filename);
        const is_asset_html = options.manifest.assets.has(filename_html);
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (options.read) {
            const type = is_asset ? options.manifest.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            response = new Response(options.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          } else {
            response = await fetch(`${event.url.origin}/${file}`, opts);
          }
        } else if (is_root_relative(resolved)) {
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            const authorization = event.request.headers.get("authorization");
            const combined_cookies = __spreadValues({}, cookies);
            for (const cookie2 of new_cookies) {
              if (!domain_matches(event.url.hostname, cookie2.domain))
                continue;
              if (!path_matches(resolved, cookie2.path))
                continue;
              combined_cookies[cookie2.name] = cookie2.value;
            }
            const cookie = Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
            if (cookie) {
              opts.headers.set("cookie", cookie);
            }
            if (authorization && !opts.headers.has("authorization")) {
              opts.headers.set("authorization", authorization);
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          response = await respond(new Request(new URL(requested, event.url).href, __spreadValues({}, opts)), options, __spreadProps(__spreadValues({}, state), {
            initiator: route
          }));
          if (state.prerendering) {
            dependency = { response, body: null };
            state.prerendering.dependencies.set(resolved, dependency);
          }
        } else {
          if (resolved.startsWith("//")) {
            requested = event.url.protocol + requested;
          }
          if (`.${new URL(requested).hostname}`.endsWith(`.${event.url.hostname}`) && opts.credentials !== "omit") {
            uses_credentials = true;
            const cookie = event.request.headers.get("cookie");
            if (cookie)
              opts.headers.set("cookie", cookie);
          }
          const external_request = new Request(requested, opts);
          response = await options.hooks.externalFetch.call(null, external_request);
        }
        const set_cookie = response.headers.get("set-cookie");
        if (set_cookie) {
          new_cookies.push(...splitCookiesString_12(set_cookie).map((str) => parseString_1(str)));
        }
        const proxy = new Proxy(response, {
          get(response2, key2, _receiver) {
            async function text() {
              const body = await response2.text();
              const headers = {};
              for (const [key3, value] of response2.headers) {
                if (key3 !== "set-cookie" && key3 !== "etag") {
                  headers[key3] = value;
                }
              }
              if (!opts.body || typeof opts.body === "string") {
                const status_number = Number(response2.status);
                if (isNaN(status_number)) {
                  throw new Error(`response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`);
                }
                fetched.push({
                  url: requested,
                  body: opts.body,
                  response: {
                    status: status_number,
                    statusText: response2.statusText,
                    headers,
                    body
                  }
                });
              }
              if (dependency) {
                dependency.body = body;
              }
              return body;
            }
            if (key2 === "arrayBuffer") {
              return async () => {
                const buffer = await response2.arrayBuffer();
                if (dependency) {
                  dependency.body = new Uint8Array(buffer);
                }
                return buffer;
              };
            }
            if (key2 === "text") {
              return text;
            }
            if (key2 === "json") {
              return async () => {
                return JSON.parse(await text());
              };
            }
            return Reflect.get(response2, key2, response2);
          }
        });
        return proxy;
      },
      stuff: __spreadValues({}, stuff),
      status: is_error ? status ?? null : null,
      error: is_error ? error2 ?? null : null
    };
    if (options.dev) {
      Object.defineProperty(load_input, "page", {
        get: () => {
          throw new Error("`page` in `load` functions has been replaced by `url` and `params`");
        }
      });
    }
    loaded = await module2.load.call(null, load_input);
    if (!loaded) {
      throw new Error(`load function must return a value${options.dev ? ` (${node.entry})` : ""}`);
    }
  } else if (shadow.body) {
    loaded = {
      props: shadow.body
    };
  } else {
    loaded = {};
  }
  if (shadow.body && state.prerendering) {
    const pathname = `${event.url.pathname.replace(/\/$/, "")}/__data.json`;
    const dependency = {
      response: new Response(void 0),
      body: JSON.stringify(shadow.body)
    };
    state.prerendering.dependencies.set(pathname, dependency);
  }
  return {
    node,
    props: shadow.body,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers: new_cookies.map((new_cookie) => {
      const _a = new_cookie, { name, value } = _a, options2 = __objRest(_a, ["name", "value"]);
      return serialize_1(name, value, options2);
    }),
    uses_credentials
  };
}
async function load_shadow_data(route, event, options, prerender) {
  if (!route.shadow)
    return {};
  try {
    const mod = await route.shadow();
    if (prerender && (mod.post || mod.put || mod.del || mod.patch)) {
      throw new Error("Cannot prerender pages that have endpoints with mutative methods");
    }
    const method = normalize_request_method(event);
    const is_get = method === "head" || method === "get";
    const handler = method === "head" ? mod.head || mod.get : mod[method];
    if (!handler && !is_get) {
      return {
        status: 405,
        error: new Error(`${method} method not allowed`)
      };
    }
    const data = {
      status: 200,
      cookies: [],
      body: {}
    };
    if (!is_get) {
      const result = await handler(event);
      if (result.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      const { status, headers, body } = validate_shadow_output(result);
      data.status = status;
      add_cookies(data.cookies, headers);
      if (status >= 300 && status < 400) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = body;
    }
    const get4 = method === "head" && mod.head || mod.get;
    if (get4) {
      const result = await get4(event);
      if (result.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      const { status, headers, body } = validate_shadow_output(result);
      add_cookies(data.cookies, headers);
      data.status = status;
      if (status >= 400) {
        data.error = new Error("Failed to load data");
        return data;
      }
      if (status >= 300) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = __spreadValues(__spreadValues({}, body), data.body);
    }
    return data;
  } catch (e2) {
    const error2 = coalesce_to_error(e2);
    options.handle_error(error2, event);
    return {
      status: 500,
      error: error2
    };
  }
}
function add_cookies(target, headers) {
  const cookies = headers["set-cookie"];
  if (cookies) {
    if (Array.isArray(cookies)) {
      target.push(...cookies);
    } else {
      target.push(cookies);
    }
  }
}
function validate_shadow_output(result) {
  const { status = 200, body = {} } = result;
  let headers = result.headers || {};
  if (headers instanceof Headers) {
    if (headers.has("set-cookie")) {
      throw new Error("Endpoint request handler cannot use Headers interface with Set-Cookie headers");
    }
  } else {
    headers = lowercase_keys(headers);
  }
  if (!is_pojo(body)) {
    throw new Error("Body returned from endpoint request handler must be a plain object");
  }
  return { status, headers, body };
}
async function respond_with_error({
  event,
  options,
  state,
  $session,
  status,
  error: error2,
  resolve_opts
}) {
  try {
    const branch = [];
    let stuff = {};
    if (resolve_opts.ssr) {
      const default_layout = await options.manifest._.nodes[0]();
      const default_error = await options.manifest._.nodes[1]();
      const layout_loaded = await load_node({
        event,
        options,
        state,
        route: null,
        node: default_layout,
        $session,
        stuff: {},
        is_error: false,
        is_leaf: false
      });
      const error_loaded = await load_node({
        event,
        options,
        state,
        route: null,
        node: default_error,
        $session,
        stuff: layout_loaded ? layout_loaded.stuff : {},
        is_error: true,
        is_leaf: false,
        status,
        error: error2
      });
      branch.push(layout_loaded, error_loaded);
      stuff = error_loaded.stuff;
    }
    return await render_response({
      options,
      state,
      $session,
      page_config: {
        hydrate: options.hydrate,
        router: options.router
      },
      stuff,
      status,
      error: error2,
      branch,
      event,
      resolve_opts
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return new Response(error3.stack, {
      status: 500
    });
  }
}
async function respond$1(opts) {
  const { event, options, state, $session, route, resolve_opts } = opts;
  let nodes;
  if (!resolve_opts.ssr) {
    return await render_response(__spreadProps(__spreadValues({}, opts), {
      branch: [],
      page_config: {
        hydrate: true,
        router: true
      },
      status: 200,
      error: null,
      event,
      stuff: {}
    }));
  }
  try {
    nodes = await Promise.all(route.a.map((n) => n == void 0 ? n : options.manifest._.nodes[n]()));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return await respond_with_error({
      event,
      options,
      state,
      $session,
      status: 500,
      error: error3,
      resolve_opts
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options);
  if (state.prerendering) {
    const should_prerender = leaf.prerender ?? options.prerender.default;
    if (!should_prerender) {
      return new Response(void 0, {
        status: 204
      });
    }
  }
  let branch = [];
  let status = 200;
  let error2 = null;
  let set_cookie_headers = [];
  let stuff = {};
  ssr: {
    for (let i2 = 0; i2 < nodes.length; i2 += 1) {
      const node = nodes[i2];
      let loaded;
      if (node) {
        try {
          loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
            node,
            stuff,
            is_error: false,
            is_leaf: i2 === nodes.length - 1
          }));
          set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
          if (loaded.loaded.redirect) {
            return with_cookies(new Response(void 0, {
              status: loaded.loaded.status,
              headers: {
                location: loaded.loaded.redirect
              }
            }), set_cookie_headers);
          }
          if (loaded.loaded.error) {
            ({ status, error: error2 } = loaded.loaded);
          }
        } catch (err) {
          const e2 = coalesce_to_error(err);
          options.handle_error(e2, event);
          status = 500;
          error2 = e2;
        }
        if (loaded && !error2) {
          branch.push(loaded);
        }
        if (error2) {
          while (i2--) {
            if (route.b[i2]) {
              const index24 = route.b[i2];
              const error_node = await options.manifest._.nodes[index24]();
              let node_loaded;
              let j = i2;
              while (!(node_loaded = branch[j])) {
                j -= 1;
              }
              try {
                const error_loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
                  node: error_node,
                  stuff: node_loaded.stuff,
                  is_error: true,
                  is_leaf: false,
                  status,
                  error: error2
                }));
                if (error_loaded.loaded.error) {
                  continue;
                }
                page_config = get_page_config(error_node.module, options);
                branch = branch.slice(0, j + 1).concat(error_loaded);
                stuff = __spreadValues(__spreadValues({}, node_loaded.stuff), error_loaded.stuff);
                break ssr;
              } catch (err) {
                const e2 = coalesce_to_error(err);
                options.handle_error(e2, event);
                continue;
              }
            }
          }
          return with_cookies(await respond_with_error({
            event,
            options,
            state,
            $session,
            status,
            error: error2,
            resolve_opts
          }), set_cookie_headers);
        }
      }
      if (loaded && loaded.loaded.stuff) {
        stuff = __spreadValues(__spreadValues({}, stuff), loaded.loaded.stuff);
      }
    }
  }
  try {
    return with_cookies(await render_response(__spreadProps(__spreadValues({}, opts), {
      stuff,
      event,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    })), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return with_cookies(await respond_with_error(__spreadProps(__spreadValues({}, opts), {
      status: 500,
      error: error3
    })), set_cookie_headers);
  }
}
function get_page_config(leaf, options) {
  if ("ssr" in leaf) {
    throw new Error("`export const ssr` has been removed \u2014 use the handle hook instead: https://kit.svelte.dev/docs/hooks#handle");
  }
  return {
    router: "router" in leaf ? !!leaf.router : options.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    set_cookie_headers.forEach((value) => {
      response.headers.append("set-cookie", value);
    });
  }
  return response;
}
async function render_page(event, route, options, state, resolve_opts) {
  if (state.initiator === route) {
    return new Response(`Not found: ${event.url.pathname}`, {
      status: 404
    });
  }
  if (route.shadow) {
    const type = negotiate(event.request.headers.get("accept") || "text/html", [
      "text/html",
      "application/json"
    ]);
    if (type === "application/json") {
      return render_endpoint(event, await route.shadow());
    }
  }
  const $session = await options.hooks.getSession(event);
  return respond$1({
    event,
    options,
    state,
    $session,
    resolve_opts,
    route
  });
}
function negotiate(accept, types2) {
  const parts = accept.split(",").map((str, i2) => {
    const match = /([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      return { type, subtype, q: +q, i: i2 };
    }
    throw new Error(`Invalid Accept header: ${accept}`);
  }).sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }
    if (a.subtype === "*" !== (b.subtype === "*")) {
      return a.subtype === "*" ? 1 : -1;
    }
    if (a.type === "*" !== (b.type === "*")) {
      return a.type === "*" ? 1 : -1;
    }
    return a.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types2) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex((part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*"));
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
function exec(match, names, types2, matchers) {
  const params = {};
  for (let i2 = 0; i2 < names.length; i2 += 1) {
    const name = names[i2];
    const type = types2[i2];
    const value = match[i2 + 1] || "";
    if (type) {
      const matcher = matchers[type];
      if (!matcher)
        throw new Error(`Missing "${type}" param matcher`);
      if (!matcher(value))
        return;
    }
    params[name] = value;
  }
  return params;
}
var DATA_SUFFIX = "/__data.json";
var default_transform = ({ html }) => html;
async function respond(request, options, state) {
  var _a, _b, _c, _d;
  let url = new URL(request.url);
  const { parameter, allowed } = options.method_override;
  const method_override = (_a = url.searchParams.get(parameter)) == null ? void 0 : _a.toUpperCase();
  if (method_override) {
    if (request.method === "POST") {
      if (allowed.includes(method_override)) {
        request = new Proxy(request, {
          get: (target, property, _receiver) => {
            if (property === "method")
              return method_override;
            return Reflect.get(target, property, target);
          }
        });
      } else {
        const verb = allowed.length === 0 ? "enabled" : "allowed";
        const body = `${parameter}=${method_override} is not ${verb}. See https://kit.svelte.dev/docs/configuration#methodoverride`;
        return new Response(body, {
          status: 400
        });
      }
    } else {
      throw new Error(`${parameter}=${method_override} is only allowed with POST requests`);
    }
  }
  let decoded = decodeURI(url.pathname);
  let route = null;
  let params = {};
  if (options.paths.base && !((_b = state.prerendering) == null ? void 0 : _b.fallback)) {
    if (!decoded.startsWith(options.paths.base)) {
      return new Response(void 0, { status: 404 });
    }
    decoded = decoded.slice(options.paths.base.length) || "/";
  }
  const is_data_request = decoded.endsWith(DATA_SUFFIX);
  if (is_data_request) {
    decoded = decoded.slice(0, -DATA_SUFFIX.length) || "/";
    url = new URL(url.origin + url.pathname.slice(0, -DATA_SUFFIX.length) + url.search);
  }
  if (!((_c = state.prerendering) == null ? void 0 : _c.fallback)) {
    const matchers = await options.manifest._.matchers();
    for (const candidate of options.manifest._.routes) {
      const match = candidate.pattern.exec(decoded);
      if (!match)
        continue;
      const matched = exec(match, candidate.names, candidate.types, matchers);
      if (matched) {
        route = candidate;
        params = decode_params(matched);
        break;
      }
    }
  }
  if ((route == null ? void 0 : route.type) === "page") {
    const normalized = normalize_path(url.pathname, options.trailing_slash);
    if (normalized !== url.pathname && !((_d = state.prerendering) == null ? void 0 : _d.fallback)) {
      return new Response(void 0, {
        status: 301,
        headers: {
          "x-sveltekit-normalize": "1",
          location: (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
        }
      });
    }
  }
  const event = {
    get clientAddress() {
      if (!state.getClientAddress) {
        throw new Error(`${"@sveltejs/adapter-vercel"} does not specify getClientAddress. Please raise an issue`);
      }
      Object.defineProperty(event, "clientAddress", {
        value: state.getClientAddress()
      });
      return event.clientAddress;
    },
    locals: {},
    params,
    platform: state.platform,
    request,
    routeId: route && route.id,
    url
  };
  const removed = (property, replacement, suffix = "") => ({
    get: () => {
      throw new Error(`event.${property} has been replaced by event.${replacement}` + suffix);
    }
  });
  const details = ". See https://github.com/sveltejs/kit/pull/3384 for details";
  const body_getter = {
    get: () => {
      throw new Error("To access the request body use the text/json/arrayBuffer/formData methods, e.g. `body = await request.json()`" + details);
    }
  };
  Object.defineProperties(event, {
    method: removed("method", "request.method", details),
    headers: removed("headers", "request.headers", details),
    origin: removed("origin", "url.origin"),
    path: removed("path", "url.pathname"),
    query: removed("query", "url.searchParams"),
    body: body_getter,
    rawBody: body_getter
  });
  let resolve_opts = {
    ssr: true,
    transformPage: default_transform
  };
  try {
    const response = await options.hooks.handle({
      event,
      resolve: async (event2, opts) => {
        var _a2;
        if (opts) {
          resolve_opts = {
            ssr: opts.ssr !== false,
            transformPage: opts.transformPage || default_transform
          };
        }
        if ((_a2 = state.prerendering) == null ? void 0 : _a2.fallback) {
          return await render_response({
            event: event2,
            options,
            state,
            $session: await options.hooks.getSession(event2),
            page_config: { router: true, hydrate: true },
            stuff: {},
            status: 200,
            error: null,
            branch: [],
            resolve_opts: __spreadProps(__spreadValues({}, resolve_opts), {
              ssr: false
            })
          });
        }
        if (route) {
          let response2;
          if (is_data_request && route.type === "page" && route.shadow) {
            response2 = await render_endpoint(event2, await route.shadow());
            if (request.headers.has("x-sveltekit-load")) {
              if (response2.status >= 300 && response2.status < 400) {
                const location = response2.headers.get("location");
                if (location) {
                  const headers = new Headers(response2.headers);
                  headers.set("x-sveltekit-location", location);
                  response2 = new Response(void 0, {
                    status: 204,
                    headers
                  });
                }
              }
            }
          } else {
            response2 = route.type === "endpoint" ? await render_endpoint(event2, await route.load()) : await render_page(event2, route, options, state, resolve_opts);
          }
          if (response2) {
            if (response2.status === 200 && response2.headers.has("etag")) {
              let if_none_match_value = request.headers.get("if-none-match");
              if (if_none_match_value == null ? void 0 : if_none_match_value.startsWith('W/"')) {
                if_none_match_value = if_none_match_value.substring(2);
              }
              const etag = response2.headers.get("etag");
              if (if_none_match_value === etag) {
                const headers = new Headers({ etag });
                for (const key2 of [
                  "cache-control",
                  "content-location",
                  "date",
                  "expires",
                  "vary"
                ]) {
                  const value = response2.headers.get(key2);
                  if (value)
                    headers.set(key2, value);
                }
                return new Response(void 0, {
                  status: 304,
                  headers
                });
              }
            }
            return response2;
          }
        }
        if (!state.initiator) {
          const $session = await options.hooks.getSession(event2);
          return await respond_with_error({
            event: event2,
            options,
            state,
            $session,
            status: 404,
            error: new Error(`Not found: ${event2.url.pathname}`),
            resolve_opts
          });
        }
        if (state.prerendering) {
          return new Response("not found", { status: 404 });
        }
        return await fetch(request);
      },
      get request() {
        throw new Error("request in handle has been replaced with event" + details);
      }
    });
    if (response && !(response instanceof Response)) {
      throw new Error("handle must return a Response object" + details);
    }
    return response;
  } catch (e2) {
    const error2 = coalesce_to_error(e2);
    options.handle_error(error2, event);
    try {
      const $session = await options.hooks.getSession(event);
      return await respond_with_error({
        event,
        options,
        state,
        $session,
        status: 500,
        error: error2,
        resolve_opts
      });
    } catch (e22) {
      const error3 = coalesce_to_error(e22);
      return new Response(options.dev ? error3.stack : error3.message, {
        status: 500
      });
    }
  }
}
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
var template = ({ head, body, assets: assets2, nonce }) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="Hello, I'm Mac, an avid frontend developer using cutting edge technologies to build websites you'll be happy with."
    />
    <meta property="og:title" content="Mac | Frontend Developer" />
    <meta
      property="og:description"
      content="Hello, I'm Mac, an avid frontend developer using cutting edge technologies to build websites you'll be happy with."
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="" />
    <meta property="og:image" content="` + assets2 + '/blog/my-new-site.jpeg" />\n    <meta property="og:locale" content="en_GB" />\n    <meta name="mobile-web-app-capable" content="yes" />\n    <meta name="theme-color" content="#0099cc" />\n    <link rel="icon" href="' + assets2 + '/icon.png" />\n    <link rel="canonical" href="" />\n    ' + head + "\n  </head>\n  <body>\n    <div>" + body + "</div>\n  </body>\n</html>\n";
var read = null;
set_paths({ "base": "", "assets": "" });
var Server = class {
  constructor(manifest2) {
    this.options = {
      csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
      dev: false,
      floc: false,
      get_stack: (error2) => String(error2),
      handle_error: (error2, event) => {
        this.options.hooks.handleError({
          error: error2,
          event,
          get request() {
            throw new Error("request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details");
          }
        });
        error2.stack = this.options.get_stack(error2);
      },
      hooks: null,
      hydrate: true,
      manifest: manifest2,
      method_override: { "parameter": "_method", "allowed": [] },
      paths: { base, assets },
      prefix: assets + "/_app/immutable/",
      prerender: {
        default: false,
        enabled: true
      },
      read,
      root: Root,
      service_worker: null,
      router: true,
      template,
      template_contains_nonce: false,
      trailing_slash: "never"
    };
  }
  async respond(request, options = {}) {
    if (!(request instanceof Request)) {
      throw new Error("The first argument to server.respond must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details");
    }
    if (!this.options.hooks) {
      const module2 = await Promise.resolve().then(() => (init_hooks_1c45ba0b(), hooks_1c45ba0b_exports));
      this.options.hooks = {
        getSession: module2.getSession || (() => ({})),
        handle: module2.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
        handleError: module2.handleError || (({ error: error2 }) => console.error(error2.stack)),
        externalFetch: module2.externalFetch || fetch
      };
    }
    return respond(request, this.options, options);
  }
};

// .svelte-kit/vercel-tmp/manifest.js
var manifest = {
  appDir: "_app",
  assets: /* @__PURE__ */ new Set(["avatar.jpeg", "blog/ipad-programming.jpg", "blog/my-new-site.jpeg", "g/links.jpeg", "icon.png", "links.jpeg"]),
  mimeTypes: { ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".png": "image/png" },
  _: {
    entry: { "file": "start-b978b4d8.js", "js": ["start-b978b4d8.js", "chunks/index-db76da04.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => (init__(), __exports)),
      () => Promise.resolve().then(() => (init__2(), __exports2)),
      () => Promise.resolve().then(() => (init__3(), __exports3)),
      () => Promise.resolve().then(() => (init__4(), __exports4)),
      () => Promise.resolve().then(() => (init__5(), __exports5)),
      () => Promise.resolve().then(() => (init__6(), __exports6)),
      () => Promise.resolve().then(() => (init__7(), __exports7)),
      () => Promise.resolve().then(() => (init__8(), __exports8)),
      () => Promise.resolve().then(() => (init__9(), __exports9)),
      () => Promise.resolve().then(() => (init__10(), __exports10)),
      () => Promise.resolve().then(() => (init__11(), __exports11)),
      () => Promise.resolve().then(() => (init__12(), __exports12)),
      () => Promise.resolve().then(() => (init__13(), __exports13)),
      () => Promise.resolve().then(() => (init__14(), __exports14)),
      () => Promise.resolve().then(() => (init__15(), __exports15)),
      () => Promise.resolve().then(() => (init__16(), __exports16)),
      () => Promise.resolve().then(() => (init__17(), __exports17)),
      () => Promise.resolve().then(() => (init__18(), __exports18)),
      () => Promise.resolve().then(() => (init__19(), __exports19)),
      () => Promise.resolve().then(() => (init__20(), __exports20)),
      () => Promise.resolve().then(() => (init__21(), __exports21)),
      () => Promise.resolve().then(() => (init__22(), __exports22)),
      () => Promise.resolve().then(() => (init__23(), __exports23))
    ],
    routes: [
      {
        type: "page",
        id: "",
        pattern: /^\/$/,
        names: [],
        types: [],
        path: "/",
        shadow: null,
        a: [0, 2],
        b: [1]
      },
      {
        type: "page",
        id: "about",
        pattern: /^\/about\/?$/,
        names: [],
        types: [],
        path: "/about",
        shadow: null,
        a: [0, 3],
        b: [1]
      },
      {
        type: "page",
        id: "blog",
        pattern: /^\/blog\/?$/,
        names: [],
        types: [],
        path: "/blog",
        shadow: null,
        a: [0, 4],
        b: [1]
      },
      {
        type: "page",
        id: "links",
        pattern: /^\/links\/?$/,
        names: [],
        types: [],
        path: "/links",
        shadow: null,
        a: [0, 5],
        b: [1]
      },
      {
        type: "page",
        id: "projects",
        pattern: /^\/projects\/?$/,
        names: [],
        types: [],
        path: "/projects",
        shadow: null,
        a: [0, 6],
        b: [1]
      },
      {
        type: "endpoint",
        id: "api/projects.json",
        pattern: /^\/api\/projects\.json$/,
        names: [],
        types: [],
        load: () => Promise.resolve().then(() => (init_projects_json(), projects_json_exports))
      },
      {
        type: "endpoint",
        id: "api/blog.json",
        pattern: /^\/api\/blog\.json$/,
        names: [],
        types: [],
        load: () => Promise.resolve().then(() => (init_blog_json(), blog_json_exports))
      },
      {
        type: "endpoint",
        id: "api/abrasion.json",
        pattern: /^\/api\/abrasion\.json$/,
        names: [],
        types: [],
        load: () => Promise.resolve().then(() => (init_abrasion_json(), abrasion_json_exports))
      },
      {
        type: "page",
        id: "blog/ipad-for-programming",
        pattern: /^\/blog\/ipad-for-programming\/?$/,
        names: [],
        types: [],
        path: "/blog/ipad-for-programming",
        shadow: null,
        a: [0, 7],
        b: [1]
      },
      {
        type: "page",
        id: "blog/my-new-site",
        pattern: /^\/blog\/my-new-site\/?$/,
        names: [],
        types: [],
        path: "/blog/my-new-site",
        shadow: null,
        a: [0, 8],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion",
        pattern: /^\/projects\/abrasion\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion",
        shadow: null,
        a: [0, 9],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Animation",
        pattern: /^\/projects\/abrasion\/Animation\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Animation",
        shadow: null,
        a: [0, 10],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Art Assets",
        pattern: /^\/projects\/abrasion\/Art Assets\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Art Assets",
        shadow: null,
        a: [0, 11],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Combat",
        pattern: /^\/projects\/abrasion\/Combat\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Combat",
        shadow: null,
        a: [0, 12],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Funding",
        pattern: /^\/projects\/abrasion\/Funding\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Funding",
        shadow: null,
        a: [0, 13],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Index",
        pattern: /^\/projects\/abrasion\/Index\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Index",
        shadow: null,
        a: [0, 14],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Map Outline",
        pattern: /^\/projects\/abrasion\/Map Outline\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Map Outline",
        shadow: null,
        a: [0, 15],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Polishing",
        pattern: /^\/projects\/abrasion\/Polishing\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Polishing",
        shadow: null,
        a: [0, 16],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Publish",
        pattern: /^\/projects\/abrasion\/Publish\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Publish",
        shadow: null,
        a: [0, 17],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Shop",
        pattern: /^\/projects\/abrasion\/Shop\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Shop",
        shadow: null,
        a: [0, 18],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Sound Effects",
        pattern: /^\/projects\/abrasion\/Sound Effects\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Sound Effects",
        shadow: null,
        a: [0, 19],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Soundtrack",
        pattern: /^\/projects\/abrasion\/Soundtrack\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Soundtrack",
        shadow: null,
        a: [0, 20],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/Tight Controls",
        pattern: /^\/projects\/abrasion\/Tight Controls\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/Tight Controls",
        shadow: null,
        a: [0, 21],
        b: [1]
      },
      {
        type: "page",
        id: "projects/abrasion/User Interface",
        pattern: /^\/projects\/abrasion\/User Interface\/?$/,
        names: [],
        types: [],
        path: "/projects/abrasion/User Interface",
        shadow: null,
        a: [0, 22],
        b: [1]
      }
    ],
    matchers: async () => {
      return {};
    }
  }
};

// .svelte-kit/vercel-tmp/serverless.js
installPolyfills();
var server = new Server(manifest);
var serverless_default = async (req, res) => {
  let request;
  try {
    request = await getRequest(`https://${req.headers.host}`, req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  setResponse(res, await server.respond(request, {
    getClientAddress() {
      return request.headers.get("x-forwarded-for");
    }
  }));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
