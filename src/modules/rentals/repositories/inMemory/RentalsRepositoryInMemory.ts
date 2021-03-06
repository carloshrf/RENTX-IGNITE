import ICreateRentalDTO from '@modules/rentals/dto/ICreateRentalDTO';
import Rental from '@modules/rentals/infra/typeorm/entities/Rental';

import IRentalsRepository from '../IRentalsRepository';

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[] = [];

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const rental = this.rentals.find(
      rental => rental.car_id === car_id && !rental.end_date,
    );

    return rental;
  }
  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const rental = this.rentals.find(
      rental => rental.user_id === user_id && !rental.end_date,
    );

    return rental;
  }

  async create({
    user_id,
    car_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      user_id,
      car_id,
      expected_return_date,
      start_date: new Date(),
    });

    this.rentals.push(rental);

    return rental;
  }

  async findById(id: string): Promise<Rental> {
    const car = this.rentals.find(rental => rental.id === id);

    return car;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rentals = this.rentals.filter(rental => rental.user_id === user_id);

    return rentals;
  }
}

export default RentalsRepositoryInMemory;
