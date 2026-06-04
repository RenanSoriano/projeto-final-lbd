import { query } from "../db/service.js";
import { UserType, type AuthUser } from "../types/auth.js";

export async function getDashboard(user: AuthUser) {
  if (user.tipo === UserType.Admin) {
    return getAdminDashboard(user);
  }

  if (user.tipo === UserType.Escuderia) {
    return getConstructorDashboard(user);
  }

  return getDriverDashboard(user);
}

async function getAdminDashboard(user: AuthUser) {
  const result = await query<{
    users_count: string;
    drivers_count: string;
    constructors_count: string;
    races_count: string;
  }>(`
    select
      (select count(*) from users)::text as users_count,
      (select count(*) from drivers)::text as drivers_count,
      (select count(*) from constructors)::text as constructors_count,
      (select count(*) from races)::text as races_count
  `);

  const row = result.rows[0];

  return {
    user,
    roleLabel: UserType.Admin,
    summary: {
      usersCount: Number(row?.users_count ?? 0),
      driversCount: Number(row?.drivers_count ?? 0),
      constructorsCount: Number(row?.constructors_count ?? 0),
      racesCount: Number(row?.races_count ?? 0)
    }
  };
}

async function getConstructorDashboard(user: AuthUser) {
  const result = await query<{
    constructor_id: number;
    constructor_name: string;
    associated_drivers_count: string;
  }>(
    `
      select
        c.id as constructor_id,
        c.name as constructor_name,
        count(distinct r.driver_id)::text as associated_drivers_count
      from constructors c
      left join results r on r.constructor_id = c.id
      where c.constructor_ref = $1
      group by c.id, c.name
      limit 1
    `,
    [user.idOriginal]
  );

  const row = result.rows[0];

  return {
    user,
    roleLabel: UserType.Escuderia,
    summary: {
      constructorId: row?.constructor_id ?? null,
      constructorName: row?.constructor_name ?? user.name,
      associatedDriversCount: Number(row?.associated_drivers_count ?? 0)
    }
  };
}

async function getDriverDashboard(user: AuthUser) {
  const result = await query<{
    driver_id: number;
    driver_name: string;
    constructor_name: string | null;
  }>(
    `
      select
        d.id as driver_id,
        d.given_name || ' ' || d.family_name as driver_name,
        latest_constructor.name as constructor_name
      from drivers d
      left join lateral (
        select c.name
        from results r
        join races ra on ra.id = r.race_id
        join constructors c on c.id = r.constructor_id
        where r.driver_id = d.id
        order by ra.race_date desc, ra.round desc
        limit 1
      ) latest_constructor on true
      where d.driver_ref = $1
      limit 1
    `,
    [user.idOriginal]
  );

  const row = result.rows[0];

  return {
    user,
    roleLabel: UserType.Piloto,
    summary: {
      driverId: row?.driver_id ?? null,
      driverName: row?.driver_name ?? user.name,
      constructorName: row?.constructor_name
    }
  };
}
