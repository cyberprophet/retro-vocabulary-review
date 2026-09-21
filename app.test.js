'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

function appContext() {
  const elements = new Map();
  const downloads = [];
  const blobs = [];
  const element = id => {
    if (!elements.has(id)) {
      elements.set(id, {
        value: '', hidden: true, textContent: '', innerHTML: '', className: '',
        listeners: {},
        addEventListener(name, callback) { this.listeners[name] = callback; },
        replaceChildren() {},
        click() { downloads.push(this); },
      });
    }
    return elements.get(id);
  };
  const context = vm.createContext({
    document: {getElementById: element, querySelectorAll: () => [], createElement: () => element('download')},
    Option: class {},
    Blob: class { constructor(parts) { this.parts = parts; } },
    URL: {createObjectURL: blob => { blobs.push(blob); return 'blob:test'; }, revokeObjectURL() {}},
  });
  vm.runInContext(fs.readFileSync('app.js', 'utf8'), context);
  return {context, element, downloads, blobs};
}

const packet = {
  schema: 'm2-human-review-result-v1',
  review_presentation_version: 'm2-review-presentation-v1',
  packet_fingerprint: 'fixture-fingerprint', run_id: 'fixture-run', rubric_version: 'fixture-rubric',
  reviewer: {reviewer_id: 'reviewer_1', reviewer_role: 'editor'},
  vocabularies: {alignment: ['accepted'], korean_review: ['accepted'], learning_relevance: ['Primary'], korean_review_dimensions: ['semantic_accuracy']},
  candidates: [], availability_gaps: [], senses: [],
};

test('rejects packets with an unpinned presentation', () => {
  const {context} = appContext();
  assert.throws(() => context.load({...packet, review_presentation_version: 'other'}), /presentation version/);
});

test('loads a zero-edge packet and exports its pinned presentation', () => {
  const {context, element, downloads, blobs} = appContext();
  context.load(packet);
  assert.equal(element('edge-editor').textContent, 'No candidate edges.');
  element('export').listeners.click();
  assert.equal(downloads.length, 1);
  assert.equal(downloads[0].download, 'm2-review-result.json');
  assert.equal(JSON.parse(blobs[0].parts[0]).review_presentation_version, packet.review_presentation_version);
});
