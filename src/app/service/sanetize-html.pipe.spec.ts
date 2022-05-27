import { SanetizeHtmlPipe } from './sanetize-html.pipe';

describe('SanetizeHtmlPipe', () => {
  it('create an instance', () => {
    const pipe = new SanetizeHtmlPipe();
    expect(pipe).toBeTruthy();
  });
});
