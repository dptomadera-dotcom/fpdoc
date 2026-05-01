import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Usar Supabase JWT Secret para validar tokens de Supabase
      secretOrKey: process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Supabase tokens tienen estructura: { sub: user_id, email, user_metadata, ... }
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.user_metadata?.role || 'ALUMNO'
    };
  }
}
