import { test } from 'uvu';
import assert from 'uvu/assert';

import ENV from '../../setup/env.cjs';

import { mapErrorsToFields } from '../../../src/lib/utilities/form';

test.before(ENV.setup);
test.before.each(ENV.reset);

test('it return empty object given empty input array', () => {
  assert(Object.entries(mapErrorsToFields([])).length === 0);
});
