import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ProfileUserUseCase from './ProfileUserUseCase';

class ProfileUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const profileUserUseCase = container.resolve(ProfileUserUseCase);
    const user_id = request.user.id;

    const profile = await profileUserUseCase.execute(user_id);

    return response.json(profile);
  }
}

export default ProfileUserController;
