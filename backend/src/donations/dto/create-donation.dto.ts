export class CreateDonationDto {
  donorId: string;
  institutionId: number;
  foodType: string;
  quantity: number;
  unit: string;
  expirationDate?: Date;
}
