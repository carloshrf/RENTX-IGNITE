import { getRepository, Repository } from 'typeorm';

import ICreateUserTokenDTO from '@modules/accounts/dtos/ICreateUserTokenDTO';
import UserToken from '@modules/accounts/infra/typeorm/entities/UserToken';

import IUsersTokensRepository from '../../../repositories/IUsersTokenRepository';

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      expires_date,
      refresh_token,
      user_id,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken> {
    const usersTokens = await this.repository.findOne({
      user_id,
      refresh_token,
    });
    return usersTokens;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    const token = await this.repository.findOne({ refresh_token });

    return token;
  }
}

export default UsersTokensRepository;
