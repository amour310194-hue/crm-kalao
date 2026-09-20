/*
  Webhooks list (html/webhooks.html + html/assets/js/automation.js -> HOOKS).

  `Secret` is stored raw here (it is a mock value); the reference UI masks it
  client-side with mask() before display - everything but the last 4 chars is
  replaced with bullets ("mask" helper on window.CRMS_AUTOMATION) - and only
  reveals it via the eye-toggle button ([data-wh-eye]) in the config modal.

  `SamplePayload*` / `SampleResponse*` reproduce payloadFor()/runTest() in
  automation.js for the webhook configuration modal:
    - the payload preview ([data-wh-payload]) always uses the SAME example
      deal payload, only swapping the top-level "event" key for
      `Event.toLowerCase().replace(/ /g, '.')` - this is a static-template
      quirk in the source (e.g. a "Lead Created" webhook still previews a
      deal-shaped payload) and is reproduced faithfully below.
    - the test response ([data-wh-response], [data-wh-test] / "Test webhook"
      row action) is canned: every webhook returns the same 200 OK success
      body EXCEPT one whose Status is "failing", which returns a 502 body.
*/

export type AutomationWebhookStatus = "active" | "paused" | "failing";

// mirrors STATUS in automation.js
export const AutomationWebhookStatusMeta: Record<AutomationWebhookStatus, { Label: string; Tone: string }> = {
  active: { Label: "Active", Tone: "success" },
  paused: { Label: "Paused", Tone: "warning" },
  failing: { Label: "Failing", Tone: "danger" },
};

export interface AutomationWebhookData {
  key: string;
  WebhookId: string;
  Name: string;
  Endpoint: string;
  Method: string;
  Event: string;
  LastTriggered: string;
  ResponseCode: number;
  SuccessRate: number;
  Created: string;
  Status: AutomationWebhookStatus;
  Auth: string;
  Secret: string;
  SamplePayload: string; // JSON.stringify(..., null, 2) equivalent of payloadFor()
  SampleResponseCode: number;
  SampleResponseLabel: string; // e.g. "200 OK"
  SampleResponseTime: string; // e.g. "212 ms"
  SampleResponseBody: string; // pretty-printed JSON
}

const SUCCESS_RESPONSE = {
  Code: 200,
  Label: "200 OK",
  Time: "212 ms",
  Body: `{\n  "received": true,\n  "id": "evt_8f21c0a4"\n}`,
};

const FAILING_RESPONSE = {
  Code: 502,
  Label: "502 Bad Gateway",
  Time: "5,004 ms",
  Body: `{\n  "error": "upstream_unavailable",\n  "retry_after": 60\n}`,
};

function samplePayload(eventKey: string): string {
  return `{
  "event": "${eventKey}",
  "occurred_at": "2026-08-25T08:41:12Z",
  "data": {
    "id": "D-1094",
    "name": "Northwind Logistics - Renewal",
    "amount": 96000,
    "currency": "FCFA",
    "stage": "Closed Won",
    "owner": {
      "id": "U-14",
      "name": "Adrian Herrera"
    },
    "company": {
      "id": "C-208",
      "name": "Northwind Logistics"
    }
  }
}`;
}

export const WebhooksListData: AutomationWebhookData[] = [
  {
    key: "1",
    WebhookId: "WH-01",
    Name: "Deal won - billing sync",
    Endpoint: "https://api.billing.internal/v2/crm/deal-won",
    Method: "POST",
    Event: "Deal Won",
    LastTriggered: "25 Aug 2026, 08:41",
    ResponseCode: 200,
    SuccessRate: 100,
    Created: "12 Mar 2026",
    Status: "active",
    Auth: "Bearer token",
    Secret: "whsec_9f4c2ab71d8e",
    SamplePayload: samplePayload("deal.won"),
    SampleResponseCode: SUCCESS_RESPONSE.Code,
    SampleResponseLabel: SUCCESS_RESPONSE.Label,
    SampleResponseTime: SUCCESS_RESPONSE.Time,
    SampleResponseBody: SUCCESS_RESPONSE.Body,
  },
  {
    key: "2",
    WebhookId: "WH-02",
    Name: "Lead created - marketing",
    Endpoint: "https://hooks.marketing.example.com/crm/lead",
    Method: "POST",
    Event: "Lead Created",
    LastTriggered: "25 Aug 2026, 10:14",
    ResponseCode: 200,
    SuccessRate: 99,
    Created: "04 Apr 2026",
    Status: "active",
    Auth: "HMAC signature",
    Secret: "whsec_2d81ffa60c39",
    SamplePayload: samplePayload("lead.created"),
    SampleResponseCode: SUCCESS_RESPONSE.Code,
    SampleResponseLabel: SUCCESS_RESPONSE.Label,
    SampleResponseTime: SUCCESS_RESPONSE.Time,
    SampleResponseBody: SUCCESS_RESPONSE.Body,
  },
  {
    key: "3",
    WebhookId: "WH-03",
    Name: "Payment received - finance",
    Endpoint: "https://finance.internal/api/payments/ingest",
    Method: "POST",
    Event: "Payment Received",
    LastTriggered: "24 Aug 2026, 16:58",
    ResponseCode: 201,
    SuccessRate: 98,
    Created: "19 Apr 2026",
    Status: "active",
    Auth: "Basic auth",
    Secret: "whsec_77b0e4c1a952",
    SamplePayload: samplePayload("payment.received"),
    SampleResponseCode: SUCCESS_RESPONSE.Code,
    SampleResponseLabel: SUCCESS_RESPONSE.Label,
    SampleResponseTime: SUCCESS_RESPONSE.Time,
    SampleResponseBody: SUCCESS_RESPONSE.Body,
  },
  {
    key: "4",
    WebhookId: "WH-04",
    Name: "Contact created - support desk",
    Endpoint: "https://support.example.com/hooks/contact",
    Method: "POST",
    Event: "Contact Created",
    LastTriggered: "25 Aug 2026, 09:03",
    ResponseCode: 200,
    SuccessRate: 97,
    Created: "02 May 2026",
    Status: "active",
    Auth: "API key",
    Secret: "whsec_a41c9e2b7f60",
    SamplePayload: samplePayload("contact.created"),
    SampleResponseCode: SUCCESS_RESPONSE.Code,
    SampleResponseLabel: SUCCESS_RESPONSE.Label,
    SampleResponseTime: SUCCESS_RESPONSE.Time,
    SampleResponseBody: SUCCESS_RESPONSE.Body,
  },
  {
    key: "5",
    WebhookId: "WH-05",
    Name: "Invoice created - accounting",
    Endpoint: "https://ledger.internal/v1/invoices",
    Method: "PUT",
    Event: "Invoice Created",
    LastTriggered: "23 Aug 2026, 11:07",
    ResponseCode: 502,
    SuccessRate: 64,
    Created: "30 May 2026",
    Status: "failing",
    Auth: "Bearer token",
    Secret: "whsec_5c30d81ea274",
    SamplePayload: samplePayload("invoice.created"),
    SampleResponseCode: FAILING_RESPONSE.Code,
    SampleResponseLabel: FAILING_RESPONSE.Label,
    SampleResponseTime: FAILING_RESPONSE.Time,
    SampleResponseBody: FAILING_RESPONSE.Body,
  },
  {
    key: "6",
    WebhookId: "WH-06",
    Name: "Deal lost - analytics",
    Endpoint: "https://analytics.example.com/collect/deal-lost",
    Method: "POST",
    Event: "Deal Lost",
    LastTriggered: "14 Aug 2026, 13:22",
    ResponseCode: 200,
    SuccessRate: 96,
    Created: "11 Jun 2026",
    Status: "paused",
    Auth: "None",
    Secret: "whsec_1a77b3c04de9",
    SamplePayload: samplePayload("deal.lost"),
    SampleResponseCode: SUCCESS_RESPONSE.Code,
    SampleResponseLabel: SUCCESS_RESPONSE.Label,
    SampleResponseTime: SUCCESS_RESPONSE.Time,
    SampleResponseBody: SUCCESS_RESPONSE.Body,
  },
  {
    key: "7",
    WebhookId: "WH-07",
    Name: "Contract created - legal archive",
    Endpoint: "https://legal.internal/archive/contracts",
    Method: "POST",
    Event: "Contract Created",
    LastTriggered: "22 Aug 2026, 15:40",
    ResponseCode: 200,
    SuccessRate: 100,
    Created: "28 Jun 2026",
    Status: "active",
    Auth: "HMAC signature",
    Secret: "whsec_e903f16c8b45",
    SamplePayload: samplePayload("contract.created"),
    SampleResponseCode: SUCCESS_RESPONSE.Code,
    SampleResponseLabel: SUCCESS_RESPONSE.Label,
    SampleResponseTime: SUCCESS_RESPONSE.Time,
    SampleResponseBody: SUCCESS_RESPONSE.Body,
  },
];
