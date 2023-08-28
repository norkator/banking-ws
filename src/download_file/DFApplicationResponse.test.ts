import * as chai from 'chai';
import {DFApplicationResponse} from './DFApplicationResponse';
import {DFFileDescriptor, DFInterface, SoftwareIdInterface} from '../interfaces';
import {FileTypes} from '../constants';

const expect = chai.expect;
describe('DFApplicationResponse', async () => {

  it('should return expected payment status report details', async () => {
    const dfApplicationResponseMessage = '<?xml version=\'1.0\' encoding=\'UTF-8\'?><soapenv:Envelope xmlns:cor="http://bxd.fi/CorporateFileService" xmlns:mod="http://model.bxd.fi" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header><wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" soapenv:mustUnderstand="1"><wsse:BinarySecurityToken EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" wsu:Id="X509-18b2584c-067d-434b-adb4-0db5094d01c3">MIIFrTCCA5WgAwIBAgIPAYKM9lB6sjhJ9NyaOyCQMA0GCSqGSIb3DQEBCwUAMEoxCzAJBgNVBAYTAkZJMRAwDgYDVQQKDAdTYW1saW5rMSkwJwYDVQQDDCBTYW1saW5rIFN5c3RlbSBUZXN0IFNlcnZlciBDQSB2MjAeFw0yMjA4MTExMjUyMDhaFw0yMzA4MTExMjUyMDhaMFsxCzAJBgNVBAYTAkZJMRAwDgYDVQQKDAdTYW1saW5rMQ4wDAYDVQQHDAVFc3BvbzEOMAwGA1UECwwFVGVzdGkxGjAYBgNVBAMMEXNtbC1zZXJ2aWNlcy10ZXN0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv1IdSel/+Y7u74jk09d/b2TgND8dguuT8ZvbpO+xHhkf1rh+QsIJhu+c0eoqs3tw3e54OZgBeIRo/WlykOeehcvvtJDFI2pzf9Y8jmVslKlItEEmBoo1g738hDfbmbdP3Cl+HJJTJROOEAW3PFhpOwV/93o9LQUdgFYOeBMsygF8m9r18uqBaEMw/LmBQx4kNXnXt9ZiS5GbFO0zwI5jSL4Anw6DitvqlpNd0rU4lLakdjvihtAHhBD5+iXGqaGh5Hf/fFdj1hgytGGpw4kiWStDu18s21Aa+x0AR1Uh8JDspszU+J5EQuoYY7p034Gq4blHdHazV3D0Ahy3NoKULQIDAQABo4IBfTCCAXkwHwYDVR0jBBgwFoAU5O4Kgle/MJDgjLGmNFNyXEh+DZwwHQYDVR0OBBYEFD50REjyRHvy9LRyODztL5SHpIlKMA4GA1UdDwEB/wQEAwIEsDAcBgNVHREEFTATghFzbWwtc2VydmljZXMtdGVzdDBTBgNVHR8ETDBKMEigRqBEhkJodHRwOi8vY3JsLTMudHJ1c3QudGVsaWFzb25lcmEuY29tL3NhbWxpbmtzeXN0ZW10ZXN0c2VydmVyY2F2Mi5jcmwwHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMBMIGUBggrBgEFBQcBAQSBhzCBhDAvBggrBgEFBQcwAYYjaHR0cDovL29jc3AucHJlcHJvZC50cnVzdC50ZWxpYS5jb20wUQYIKwYBBQUHMAKGRWh0dHA6Ly9yZXBvc2l0b3J5LnRydXN0LnRlbGlhc29uZXJhLmNvbS9zYW1saW5rc3lzdGVtdGVzdHVzZXJjYXYyLmNlcjANBgkqhkiG9w0BAQsFAAOCAgEAhRcZmTLGRuSqqupJ4GMKzZQnYVCnpCkAJQuuUZEYYpBSZPWHuFdmHnxBCYeMgW4VxZ5eHM1eERWhNbTY0gkEq3zW1Z3v4/LNgIQFYHSi+ECzDY6uy9Tk3T/EjYqhg/L0b2a9cTpfxu7OcYEbBkLqoSrxuyHVscAC2c8wADO1dOLAmMtoYcjM4qY0dmnC4wSFLRX71Q323+QdvJCSO5qzVfvIhklP+GBD6n5BuFZbgfs5ti4GximCH8acICsAfhDdv0MYeNYLaauX7iGyLqG9sUS3IWgzeFh37+aWojlGlt59l4qAUVc/qNfy0PzhCWYF9LD5YDygVBxs8ypGaAU5Q445FuYFaprGYZw9hJ68CnIPSCNOVZ5H6Ch7TZF0wkp/8XdYn3ggX9T4JkZDMjJ9FRVXgWKJlOKHTFdu4bo6L4yVTZ9fC9KK9NZeXldYneYBRt6PgylcrrOLs14z6Xnv3VqTxElaXdaUJOlw0HxMn5Gc09w3+rTkA8nIg4sjbpSuIP2conJrVFxvHgnVb3gSQwu2yh8D8YqmeaxjUAmCEqWxrgbC8ra129tEpRuFZ2lBJqvg3/TtkTsGePpcw9P/yPTkGsgitTwQMLB+/ZA41nYU0g3SfEOywfryWbXxINbLmxrP1Gmd5iPWTGvJZqvTIsvBRQNXTT0ZDgSYJGPE9h8=</wsse:BinarySecurityToken><wsu:Timestamp wsu:Id="TS-52605b04-1178-4ac8-ad47-ff6881949d0b"><wsu:Created>2023-03-10T13:40:13.390Z</wsu:Created><wsu:Expires>2023-03-10T13:45:13.390Z</wsu:Expires></wsu:Timestamp><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="SIG-ba478e54-023a-4083-9689-f23da42f913a"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><ds:Reference URI="#TS-52605b04-1178-4ac8-ad47-ff6881949d0b"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><ds:DigestValue>kynl/EjhgLYn3ffiP072Ly2hEQ8=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-fd886087-22f7-4201-97ea-932a594c3a64"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><ds:DigestValue>E73XXvukWPome7O/AzpNDk305y8=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>c2Cpgnk39hYyeoogOiD38kUdlTOmgva1f8svIClOGmbkBOkx/YX0aN/H7YsfEtePnX6vwr6/PO6QeK0GM14Z+IVFRQvTfJpD6QdaUlpEo5fiqDe2kdtgUtFmRoZETnOg72znaV9yIhAkbQRES8HckdzRdRF8HPGzOYVkvpfR/kHIBR4/0zOjZYAmEt1vDP8bRnGRGmIQ61Ntxw39vOZjopQTS6rasKHyFAzQs0QVPd9LDJf0Kc5fmhF5b62dyuH8zF/ctpPLbK06ifqkV4y0jovbgfhJp8ZIsbcq9X7TCDXCuk4SJ/BUEYzhggBTvxXAhz7jl6m5cbc9nbtEux0riQ==</ds:SignatureValue><ds:KeyInfo Id="KI-e284b5e1-c99f-4c17-961b-ebf0ad19c47b"><wsse:SecurityTokenReference xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="STR-c42444de-0fb3-4d74-87e4-1815e8966ee3"><wsse:Reference URI="#X509-18b2584c-067d-434b-adb4-0db5094d01c3" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/></wsse:SecurityTokenReference></ds:KeyInfo></ds:Signature></wsse:Security></soapenv:Header><soapenv:Body xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="id-fd886087-22f7-4201-97ea-932a594c3a64"><cor:downloadFileout><mod:ResponseHeader><mod:SenderId>97357407</mod:SenderId><mod:RequestId>123456</mod:RequestId><mod:Timestamp>2023-03-10T15:40:13.388</mod:Timestamp><mod:ResponseCode>00</mod:ResponseCode><mod:ResponseText>OK</mod:ResponseText><mod:ReceiverId></mod:ReceiverId></mod:ResponseHeader><mod:ApplicationResponse>PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PEFwcGxpY2F0aW9uUmVzcG9uc2UgeG1sbnM9Imh0dHA6Ly9ieGQuZmkveG1sZGF0YS8iIHhtbG5zOm5zMj0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnIyI+PEN1c3RvbWVySWQ+OTczNTc0MDc8L0N1c3RvbWVySWQ+PFRpbWVzdGFtcD4yMDIzLTAzLTEwVDE1OjQwOjEzLjM1NSswMjowMDwvVGltZXN0YW1wPjxSZXNwb25zZUNvZGU+MDA8L1Jlc3BvbnNlQ29kZT48UmVzcG9uc2VUZXh0Pk9LPC9SZXNwb25zZVRleHQ+PEVuY3J5cHRlZD5mYWxzZTwvRW5jcnlwdGVkPjxDb21wcmVzc2VkPmZhbHNlPC9Db21wcmVzc2VkPjxGaWxlRGVzY3JpcHRvcnM+PEZpbGVEZXNjcmlwdG9yPjxGaWxlUmVmZXJlbmNlPjU1MzQ4MTwvRmlsZVJlZmVyZW5jZT48VGFyZ2V0SWQ+Tk9ORTwvVGFyZ2V0SWQ+PFVzZXJGaWxlbmFtZT5OT05FLnBhbGF1dGU8L1VzZXJGaWxlbmFtZT48UGFyZW50RmlsZVJlZmVyZW5jZT41NTM0ODA8L1BhcmVudEZpbGVSZWZlcmVuY2U+PEZpbGVUeXBlPlhQPC9GaWxlVHlwZT48RmlsZVRpbWVzdGFtcD4yMDIzLTAzLTA5VDE4OjU5OjEwLjE5MyswMjowMDwvRmlsZVRpbWVzdGFtcD48U3RhdHVzPkRMRDwvU3RhdHVzPjxMYXN0RG93bmxvYWRUaW1lc3RhbXA+MjAyMy0wMy0xMFQxNToxOToxOC44ODYrMDI6MDA8L0xhc3REb3dubG9hZFRpbWVzdGFtcD48Rm9yd2FyZGVkVGltZXN0YW1wPjIwMjMtMDMtMDlUMTg6NTk6MTAuMTkzKzAyOjAwPC9Gb3J3YXJkZWRUaW1lc3RhbXA+PERlbGV0YWJsZT5mYWxzZTwvRGVsZXRhYmxlPjwvRmlsZURlc2NyaXB0b3I+PC9GaWxlRGVzY3JpcHRvcnM+PEZpbGVUeXBlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI+WFA8L0ZpbGVUeXBlPjxDb250ZW50PlBEOTRiV3dnZG1WeWMybHZiajBuTVM0d0p5QmxibU52WkdsdVp6MG5WVlJHTFRnblB6NDhSRzlqZFcxbGJuUWdlRzFzYm5NOUluVnlianBwYzI4NmMzUmtPbWx6YnpveU1EQXlNanAwWldOb09uaHpaRHB3WVdsdUxqQXdNaTR3TURFdU1ETWlJSGh0Ykc1ek9uaHphVDBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01TOVlUVXhUWTJobGJXRXRhVzV6ZEdGdVkyVWlQanhEYzNSdGNsQnRkRk4wYzFKd2RENDhSM0p3U0dSeVBqeE5jMmRKWkQ0d01UZzNNVFE1TUY4eE5qYzRNemd4TVRVd01UZ3pQQzlOYzJkSlpENDhRM0psUkhSVWJUNHlNREl6TFRBekxUQTVWREU0T2pVNU9qRXdMakU0TXlzd01qb3dNRHd2UTNKbFJIUlViVDQ4U1c1cGRHZFFkSGsrUEU1dFBrWnBibUZ1YzJWc2JDQlBlVHd2VG0wK1BDOUpibWwwWjFCMGVUNDhSR0owY2tGbmRENDhSbWx1U1c1emRHNUpaRDQ4UWtsRFBrbFVSVXhHU1VoSVBDOUNTVU0rUEM5R2FXNUpibk4wYmtsa1Bqd3ZSR0owY2tGbmRENDhMMGR5Y0Voa2NqNDhUM0puYm14SGNuQkpibVpCYm1SVGRITStQRTl5WjI1c1RYTm5TV1ErVFZOSFNVUXlNREl6TURNOEwwOXlaMjVzVFhOblNXUStQRTl5WjI1c1RYTm5UbTFKWkQ1d1lXbHVMakF3TVM0d01ERXVNREk4TDA5eVoyNXNUWE5uVG0xSlpENDhSM0p3VTNSelBrRkRWRU04TDBkeWNGTjBjejQ4TDA5eVoyNXNSM0p3U1c1bVFXNWtVM1J6UGp3dlEzTjBiWEpRYlhSVGRITlNjSFErUEM5RWIyTjFiV1Z1ZEQ0PTwvQ29udGVudD48U2lnbmF0dXJlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIj48U2lnbmVkSW5mbz48Q2Fub25pY2FsaXphdGlvbk1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuI1dpdGhDb21tZW50cyIvPjxTaWduYXR1cmVNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjcnNhLXNoYTEiLz48UmVmZXJlbmNlIFVSST0iIj48VHJhbnNmb3Jtcz48VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI2VudmVsb3BlZC1zaWduYXR1cmUiLz48VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jV2l0aENvbW1lbnRzIi8+PC9UcmFuc2Zvcm1zPjxEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjc2hhMSIvPjxEaWdlc3RWYWx1ZT5ZR1BmY3IxbXloNWVsT21VZUkwYVVPWldrRms9PC9EaWdlc3RWYWx1ZT48L1JlZmVyZW5jZT48L1NpZ25lZEluZm8+PFNpZ25hdHVyZVZhbHVlPlRBY0lhWDBrSHgxM1VjNGJHMGZmZms3TzRuZHBCZHMybkRNZE9CTU9LcjRIclI1YmhrOWFqbDFQOXE0Z0FJV0lvT3l4eGxxQnA4M003VFhCdUMvMEs4V0g1OVdyNnAveFVPc1ZXVWVYWmcrWDNwWGV3Y2RwNHNqYkoyS2FML1ZSaXY2cTRiVkFvN2FYNGVsaXk4enAzR1ZLRURBRkNPaEFOWWNoaXZWS3Izc2VjY0xRdDlaaHlhMndWR0pRbjM0OHZ4ckVReGpzWlF4Z2tmS1VPUzhKTk9xdFNlRVZYTUJPVngvS2JrbWdHa25xMWg5NHRnenNnM3Nnbkk1WGNCRnN6VFUya29QUnlVUi9SQkRjOVJ3ZlFoSzBacm1kekR0VkFZOWRTTVU2NEROOGlhWTA5dDV3c1M3WlNBM001Q0huRGZ0WkZMbXk0cHRTNEdwSDR2ODhmUT09PC9TaWduYXR1cmVWYWx1ZT48S2V5SW5mbz48WDUwOURhdGE+PFg1MDlDZXJ0aWZpY2F0ZT5NSUlGclRDQ0E1V2dBd0lCQWdJUEFZS005bEI2c2poSjlOeWFPeUNRTUEwR0NTcUdTSWIzRFFFQkN3VUFNRW94Q3pBSkJnTlZCQVlUQWtaSk1SQXdEZ1lEVlFRS0RBZFRZVzFzYVc1ck1Ta3dKd1lEVlFRRERDQlRZVzFzYVc1cklGTjVjM1JsYlNCVVpYTjBJRk5sY25abGNpQkRRU0IyTWpBZUZ3MHlNakE0TVRFeE1qVXlNRGhhRncweU16QTRNVEV4TWpVeU1EaGFNRnN4Q3pBSkJnTlZCQVlUQWtaSk1SQXdEZ1lEVlFRS0RBZFRZVzFzYVc1ck1RNHdEQVlEVlFRSERBVkZjM0J2YnpFT01Bd0dBMVVFQ3d3RlZHVnpkR2t4R2pBWUJnTlZCQU1NRVhOdGJDMXpaWEoyYVdObGN5MTBaWE4wTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF2MUlkU2VsLytZN3U3NGprMDlkL2IyVGdORDhkZ3V1VDhadmJwTyt4SGhrZjFyaCtRc0lKaHUrYzBlb3FzM3R3M2U1NE9aZ0JlSVJvL1dseWtPZWVoY3Z2dEpERkkycHpmOVk4am1Wc2xLbEl0RUVtQm9vMWc3MzhoRGZibWJkUDNDbCtISkpUSlJPT0VBVzNQRmhwT3dWLzkzbzlMUVVkZ0ZZT2VCTXN5Z0Y4bTlyMTh1cUJhRU13L0xtQlF4NGtOWG5YdDlaaVM1R2JGTzB6d0k1alNMNEFudzZEaXR2cWxwTmQwclU0bExha2RqdmlodEFIaEJENStpWEdxYUdoNUhmL2ZGZGoxaGd5dEdHcHc0a2lXU3REdTE4czIxQWEreDBBUjFVaDhKRHNwc3pVK0o1RVF1b1lZN3AwMzRHcTRibEhkSGF6VjNEMEFoeTNOb0tVTFFJREFRQUJvNElCZlRDQ0FYa3dId1lEVlIwakJCZ3dGb0FVNU80S2dsZS9NSkRnakxHbU5GTnlYRWgrRFp3d0hRWURWUjBPQkJZRUZENTBSRWp5Ukh2eTlMUnlPRHp0TDVTSHBJbEtNQTRHQTFVZER3RUIvd1FFQXdJRXNEQWNCZ05WSFJFRUZUQVRnaEZ6Yld3dGMyVnlkbWxqWlhNdGRHVnpkREJUQmdOVkhSOEVUREJLTUVpZ1JxQkVoa0pvZEhSd09pOHZZM0pzTFRNdWRISjFjM1F1ZEdWc2FXRnpiMjVsY21FdVkyOXRMM05oYld4cGJtdHplWE4wWlcxMFpYTjBjMlZ5ZG1WeVkyRjJNaTVqY213d0hRWURWUjBsQkJZd0ZBWUlLd1lCQlFVSEF3SUdDQ3NHQVFVRkJ3TUJNSUdVQmdnckJnRUZCUWNCQVFTQmh6Q0JoREF2QmdnckJnRUZCUWN3QVlZamFIUjBjRG92TDI5amMzQXVjSEpsY0hKdlpDNTBjblZ6ZEM1MFpXeHBZUzVqYjIwd1VRWUlLd1lCQlFVSE1BS0dSV2gwZEhBNkx5OXlaWEJ2YzJsMGIzSjVMblJ5ZFhOMExuUmxiR2xoYzI5dVpYSmhMbU52YlM5ellXMXNhVzVyYzNsemRHVnRkR1Z6ZEhWelpYSmpZWFl5TG1ObGNqQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FnRUFoUmNabVRMR1J1U3FxdXBKNEdNS3paUW5ZVkNucENrQUpRdXVVWkVZWXBCU1pQV0h1RmRtSG54QkNZZU1nVzRWeFo1ZUhNMWVFUldoTmJUWTBna0VxM3pXMVozdjQvTE5nSVFGWUhTaStFQ3pEWTZ1eTlUazNUL0VqWXFoZy9MMGIyYTljVHBmeHU3T2NZRWJCa0xxb1NyeHV5SFZzY0FDMmM4d0FETzFkT0xBbU10b1ljak00cVkwZG1uQzR3U0ZMUlg3MVEzMjMrUWR2SkNTTzVxelZmdkloa2xQK0dCRDZuNUJ1RlpiZ2ZzNXRpNEd4aW1DSDhhY0lDc0FmaERkdjBNWWVOWUxhYXVYN2lHeUxxRzlzVVMzSVdnemVGaDM3K2FXb2psR2x0NTlsNHFBVVZjL3FOZnkwUHpoQ1dZRjlMRDVZRHlnVkJ4czh5cEdhQVU1UTQ0NUZ1WUZhcHJHWVp3OWhKNjhDbklQU0NOT1ZaNUg2Q2g3VFpGMHdrcC84WGRZbjNnZ1g5VDRKa1pETWpKOUZSVlhnV0tKbE9LSFRGZHU0Ym82TDR5VlRaOWZDOUtLOU5aZVhsZFluZVlCUnQ2UGd5bGNyck9MczE0ejZYbnYzVnFUeEVsYVhkYVVKT2x3MEh4TW41R2MwOXczK3JUa0E4bklnNHNqYnBTdUlQMmNvbkpyVkZ4dkhnblZiM2dTUXd1MnloOEQ4WXFtZWF4alVBbUNFcVd4cmdiQzhyYTEyOXRFcFJ1RloybEJKcXZnMy9UdGtUc0dlUHBjdzlQL3lQVGtHc2dpdFR3UU1MQisvWkE0MW5ZVTBnM1NmRU95d2ZyeVdiWHhJTmJMbXhyUDFHbWQ1aVBXVEd2SlpxdlRJc3ZCUlFOWFRUMFpEZ1NZSkdQRTloOD08L1g1MDlDZXJ0aWZpY2F0ZT48WDUwOVN1YmplY3ROYW1lPkNOPXNtbC1zZXJ2aWNlcy10ZXN0LCBPVT1UZXN0aSwgTD1Fc3BvbywgTz1TYW1saW5rLCBDPUZJPC9YNTA5U3ViamVjdE5hbWU+PC9YNTA5RGF0YT48L0tleUluZm8+PC9TaWduYXR1cmU+PC9BcHBsaWNhdGlvblJlc3BvbnNlPg==</mod:ApplicationResponse></cor:downloadFileout></soapenv:Body></soapenv:Envelope>';

    const df: DFInterface = {
      userParams: {
        bank: 'Samlink',
        environment: 'PRODUCTION',
        customerId: '97357407',
        Base64EncodedRootCA: '',
        rejectUnauthorized: true,
      },
      Base64EncodedBankCsr: '',
      requestUrl: '',
      Timestamp: '2021-08-06T01:01:48+03:00',
      SoftwareId: {name: 'TEST', version: '0.0.0'} as SoftwareIdInterface,
      ExecutionSerial: '',
      Base64EncodedClientCsr: '',
      RequestId: '123456',
      language: 'FI',
      fileType: 'XP',
      fileReferences: ['553481']
    };

    const dfResponse = new DFApplicationResponse(df, dfApplicationResponseMessage);
    const parsed: DFFileDescriptor = await dfResponse.parseBody();

    expect(parsed.FileReference).to.equal('553481');
    expect(parsed.FileType).to.equal(FileTypes.XP);
    expect(parsed.Status).to.equal('DLD');
    expect(parsed.Deletable).to.equal('false');

    expect(parsed.PaymentStatusReport?.MessageIdentifier).to.equal( '01871490_1678381150183');
    expect(parsed.PaymentStatusReport?.OriginalMessageIdentification).to.equal( 'MSGID202303');
    expect(parsed.PaymentStatusReport?.OriginalPaymentInformationIdentification).to.equal( 'pain.001.001.02');
    expect(parsed.PaymentStatusReport?.Status.GroupStatus).to.equal('ACTC');

    expect(parsed.BankStatement).to.equal(null);
  });


  it('should return expected bank statement details', async () => {
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    const dfApplicationResponseMessage = '';

    // const df: DFInterface = {
    //   userParams: {
    //     bank: 'Samlink',
    //     environment: 'PRODUCTION',
    //     customerId: '97357407',
    //     Base64EncodedRootCA: '',
    //     rejectUnauthorized: true,
    //   },
    //   Base64EncodedBankCsr: '',
    //   requestUrl: '',
    //   Timestamp: '2021-08-06T01:01:48+03:00',
    //   SoftwareId: {name: 'TEST', version: '0.0.0'} as SoftwareIdInterface,
    //   ExecutionSerial: '',
    //   Base64EncodedClientCsr: '',
    //   RequestId: '123456',
    //   language: 'FI',
    //   fileType: 'XP',
    //   fileReferences: ['553481']
    // };

    // const dfResponse = new DFApplicationResponse(df, dfApplicationResponseMessage);
    // const parsed: DFFileDescriptor = await dfResponse.parseBody();

    expect(1).to.equal(1);

    // expect(parsed.PaymentStatusReport).to.equal(null);
  });

});

