test('intentionally fails to verify the automation failure path', () => {
  throw new Error('Intentional automation failure probe (issue #7)');
});
