import { Achievement, CreateAchievementDto } from "../types/achievement";

export interface IAchievementRepository {
  findAll(): Promise<Achievement[]>;
  create(data: CreateAchievementDto): Promise<Achievement>;
}
