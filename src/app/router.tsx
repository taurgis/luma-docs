// Central router creation point enabling React Router recommended future flags.
// This silences v7 upgrade warnings by explicitly opting into stable upcoming behaviours.
// If additional flags become available, extend the future object here only.

// React Router future flags attempted here were removed because the current installed
// version (6.30.x) does not expose type definitions for those v7_* flags yet.
// Keeping this file as a placeholder so when upgrading to RR v7 we can centralize
// the router creation without touching multiple entry points.
// For now, vite-react-ssg handles route mounting via main.tsx.

export {};
