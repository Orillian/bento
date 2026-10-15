// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
//
// How a whole-document restore treats each field — bento/type's row in the
// kernel's restore table (kernel/src/docfields.ts applyRestore).
//
// Every whole-document restore goes through this, in one of two directions:
//
//   'back'     undo / redo of a document-level step, and restoring a version
//              from About's version history — going BACK in time. Content
//              follows the older copy; history stays LIVE, so going back can
//              never discard revisions made since.
//   'recover'  the crash-recovery banner — the snapshot is a NEWER copy of this
//              same document, and the person chose it over the file. Content
//              AND history follow it, so revisions and the signatures over them
//              come back as one self-consistent unit, never split.
//
// Identity, mode and capability always stay live, in both directions — the
// kernel's floor, which no override here can move.
//
// One override: `comments` is history-class (for COPYING — a view-only copy
// drops it) but FOLLOWS a restore, so adding, resolving or deleting a comment
// stays undoable like any edit. The class answers "how is it copied"; this
// answers "does a restore move it" — two questions, kept apart.
//
// A paste (Replace from JSON, bento.loadDoc) is not a restore and does not come
// through here: it never installs history at all (docclass.ts keepLiveHistory).

import { restoreOverrides, validateRestoreRules, type RestoreRules } from '../../kernel/src/docfields.ts';
import { TYPE_FIELDS } from './docclass.ts';

export const RESTORE_RULES: RestoreRules = {
  classes: TYPE_FIELDS,
  // restoreOverrides makes naming an identity, mode or capability field a
  // COMPILE error; validateRestoreRules below is the runtime backstop.
  keepLive: restoreOverrides(TYPE_FIELDS, { comments: 'follows' }),
};

validateRestoreRules(RESTORE_RULES);
