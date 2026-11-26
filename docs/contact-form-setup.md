# Activate email enquiries

The contact form is disabled until a real Formspree form endpoint is configured. WhatsApp and direct email remain available. The site stays static; no private mail credentials are needed in the browser.

1. Create an account at https://formspree.io/ and create a form in your own project.
2. Set the recipient/notification email to `flourishevents313@gmail.com`, verify the address, and enable email notifications. Configure the Reply-To field to use the visitor's `email` field. Review provider spam protection, allowed domains, quotas and privacy requirements before enabling public submissions.
3. Copy the exact endpoint from the form integration settings (`https://formspree.io/f/` followed by your assigned ID).
4. Locally, add `PUBLIC_FORMSPREE_ENDPOINT` to `.env` using the actual URL. Do not overwrite existing site URL/indexing configuration. Restart `npm run dev` or rebuild for preview. Do not commit `.env`.
5. In Vercel, set the same variable under your project's Settings > Environment Variables for the applicable Preview and Production environments, then redeploy. Use your own real endpoint; never put a private API key in a `PUBLIC_` variable.
6. Submit an explicitly marked test enquiry. Verify that it appears in the provider dashboard AND reaches the correct inbox. Verify Reply-To, rejection and spam controls. A successful API response confirms provider acceptance, not inbox delivery or a booking.

## Local QA

`PUBLIC_ENABLE_INDEXING=false npm run qa` tests the unconfigured fallback when no endpoint is set. Configured submission tests use intercepted network responses and never send email. To run those tests after configuring your local `.env`:

```sh
PUBLIC_ENABLE_INDEXING=false npm run build
npm test -- tests/refinement.spec.ts
```

If Formspree domain restrictions are enabled, allow the correct local or preview origin when testing real delivery. Do not disable production spam protection to make a test pass. Keep existing direct contact methods available if the provider is unavailable.

No account, endpoint, inbox access or deployment is provisioned by this source archive.
