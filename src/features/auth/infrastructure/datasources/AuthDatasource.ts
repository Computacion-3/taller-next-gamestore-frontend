import {
  AuthResponseDto,
  LoginRequestDto,
  LogoutResponseDto,
  ProfileResponseDto,
  RegisterRequestDto,
} from '../dtos/AuthDto';

export interface AuthDatasource {
  login(dto: LoginRequestDto): Promise<AuthResponseDto>;
  register(dto: RegisterRequestDto): Promise<AuthResponseDto>;
  logout(): Promise<LogoutResponseDto>;
  getProfile(): Promise<ProfileResponseDto>;
}
