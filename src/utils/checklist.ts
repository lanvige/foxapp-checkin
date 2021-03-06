import { IUserEntity } from 'app/entities/user.interface';

export class Checklist {
  private static instance: Checklist;
  private users: Map<string, IUserEntity> = new Map();
  private checkedlist: Map<string, boolean> = new Map();

  private constructor() {
    // ..
  }

  public static getInstance() {
    if (!Checklist.instance) {
      Checklist.instance = new Checklist();
    }

    return Checklist.instance;
  }

  // add user
  register(user: IUserEntity): number {
    this.users.set(user.phone, user);

    return this.users.size;
  }

  // fetch
  fetch(key: string): IUserEntity {
    return this.users.get(key);
  }

  fetchUsers(): Map<string, IUserEntity> {
    return this.users;
  }

  abc() {
    this.checkedlist.set('xxx', true);
  }

  abcd(checkKey: string) {
    this.checkedlist.get(checkKey);
  }
}
