import { inject } from "@angular/core";
import { SecurePipe } from "./secure.pipe";

describe('SecurePipe', () => {
  it('create an instance', () => {
    const pipe = new SecurePipe(null,null);
    expect(pipe).toBeTruthy();
  });
});
