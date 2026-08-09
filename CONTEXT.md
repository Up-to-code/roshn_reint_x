# Domain glossary

## Property

A real-estate listing presented publicly and managed by administrators. The Property module owns its canonical fields, validation, persistence, lifecycle effects, cache invalidation, and localized presentation. Public adapters may read and search Properties; only administrators may create, update, or delete them.

## Authorization

The capability policy that classifies access as anonymous, authenticated self-access, or administrator access. Public content reads and intake submissions are intentional anonymous seams. Private records, operational tools, publishing changes, content changes, and user administration require an administrator. Account changes require the account owner or an administrator.

## Site Content

The versioned content document containing global navigation, footer, logo, metadata, and localized homepage content. The Site Content module owns canonical defaults, legacy normalization, validation, caching, and atomic section persistence. Homepage and global-setting editors update independent sections so one editor cannot overwrite another.

## Inquiry

A private intake record classified as a general contact, property interest, or landing-page lead. The Inquiry module owns validation, property association, lifecycle state, persistence, event recording, and notification policy. Public adapters may submit inquiries; only administrators may read, edit, mark, or delete them.

## Publishing

The lifecycle of authored posts through draft, published, and archived states. The Publishing module owns validation, public visibility, editor access, duplication, serialization, and cache invalidation. Public readers can only observe published posts; administrators can manage every state.

## Media Storage

The authenticated upload and public-delivery boundary for images, videos, and files. The Media Storage module owns bucket policy, MIME and size validation, object naming, privileged provider access, status inspection, and idempotent provisioning. Browser code never receives the storage service credential and never requires anonymous write policies.

## Service Catalog

The public catalog of enabled real-estate services and its page presentation. The Service module owns canonical defaults, validation, ordering, visibility, persistence, and cache invalidation. Public readers only receive enabled entries; administrators can manage the complete catalog.

## About Content

The public company story containing hero, vision, mission, goals, and tagline. The About module owns canonical defaults, legacy normalization, strict writes, persistence, and cache invalidation. Public reads never create or mutate database rows.

## Event Log

An append-only operational record emitted by domain workflows. The Event module owns accepted event types, metadata boundaries, best-effort recording, and bounded administrator reads. Events cannot be synthesized or manually injected through public HTTP mutations.

## User Administration

The protected management of user profiles and administrator capability. The User module owns safe projections, name and role validation, persistence, and lockout prevention. Administrators cannot demote themselves or remove the final administrator capability.
