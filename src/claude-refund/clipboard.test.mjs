import test from 'node:test';
import assert from 'node:assert/strict';
import { copyText } from './clipboard.js';

test('复制当前编辑文本，不在实际写入完成前报告成功', async () => {
  let written = '';
  let complete;
  const pending = copyText('用户修改后的申请', () => assert.fail('不应进入降级'), { writeText: value => new Promise(resolve => { written = value; complete = resolve; }) });
  assert.equal(written, '用户修改后的申请');
  complete();
  assert.equal(await pending, true);
});

test('剪贴板被拒绝或不可用时调用手动复制入口，不报告成功', async () => {
  for (const clipboard of [null, {}, { writeText: async () => { throw new Error('NotAllowedError'); } }]) {
    let selected = false;
    assert.equal(await copyText('申请内容', () => { selected = true; }, clipboard), false);
    assert.equal(selected, true);
  }
});
