import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DatabaseService } from "../database/database.service"; // normal import
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService, // inject DatabaseService instead of Pool
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const result = await this.db.query(
      "SELECT * FROM users WHERE email = $1 AND is_active = true",
      [email]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
  }

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const result = await this.db.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        userData.email,
        hashedPassword,
        userData.role,
        userData.firstName,
        userData.lastName,
        userData.phone || null,
      ]
    );

    const { password_hash, ...userWithoutPassword } = result.rows[0];
    return userWithoutPassword;
  }
}
