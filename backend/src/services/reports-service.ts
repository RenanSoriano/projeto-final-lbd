import { query } from "../db/service.js";
import type { AuthUser } from "../types/auth.js";

export async function getAdminOverviewReport() {
  const result = await query(`
    select
      (select count(*) from users)::int as users_count,
      (select count(*) from drivers)::int as drivers_count,
      (select count(*) from constructors)::int as constructors_count,
      (select count(*) from races)::int as races_count,
      (select count(*) from results)::int as results_count
  `);

  return result.rows;
}

export async function getAdminTopDriversReport() {
  const result = await query(`
    select
      d.id,
      d.driver_ref,
      d.given_name || ' ' || d.family_name as driver_name,
      sum(r.points) as total_points,
      count(*)::int as races_count
    from results r
    join drivers d on d.id = r.driver_id
    group by d.id, d.driver_ref, d.given_name, d.family_name
    order by total_points desc nulls last, driver_name asc
    limit 20
  `);

  return result.rows;
}

export async function getAdminTopConstructorsReport() {
  const result = await query(`
    select
      c.id,
      c.constructor_ref,
      c.name as constructor_name,
      sum(r.points) as total_points,
      count(distinct r.driver_id)::int as drivers_count
    from results r
    join constructors c on c.id = r.constructor_id
    group by c.id, c.constructor_ref, c.name
    order by total_points desc nulls last, constructor_name asc
    limit 20
  `);

  return result.rows;
}

export async function getConstructorDriversReport(user: AuthUser) {
  const result = await query(
    `
      select
        d.id,
        d.driver_ref,
        d.given_name || ' ' || d.family_name as driver_name,
        count(*)::int as races_count,
        sum(r.points) as total_points
      from users u
      join constructors c on c.constructor_ref = u.idoriginal
      join results r on r.constructor_id = c.id
      join drivers d on d.id = r.driver_id
      where u.userid = $1
      group by d.id, d.driver_ref, d.given_name, d.family_name
      order by total_points desc nulls last, driver_name asc
    `,
    [user.userId]
  );

  return result.rows;
}

export async function getConstructorRaceResultsReport(user: AuthUser) {
  const result = await query(
    `
      select
        ra.race_date,
        ra.race_name,
        d.given_name || ' ' || d.family_name as driver_name,
        r.position_order,
        r.points,
        r.laps
      from users u
      join constructors c on c.constructor_ref = u.idoriginal
      join results r on r.constructor_id = c.id
      join races ra on ra.id = r.race_id
      join drivers d on d.id = r.driver_id
      where u.userid = $1
      order by ra.race_date desc, ra.round desc, r.position_order asc
      limit 100
    `,
    [user.userId]
  );

  return result.rows;
}

export async function getDriverRaceResultsReport(user: AuthUser) {
  const result = await query(
    `
      select
        ra.race_date,
        ra.race_name,
        c.name as constructor_name,
        r.grid,
        r.position,
        r.position_order,
        r.points,
        r.laps
      from users u
      join drivers d on d.driver_ref = u.idoriginal
      join results r on r.driver_id = d.id
      join races ra on ra.id = r.race_id
      join constructors c on c.id = r.constructor_id
      where u.userid = $1
      order by ra.race_date desc, ra.round desc
      limit 100
    `,
    [user.userId]
  );

  return result.rows;
}

export async function getDriverPerformanceSummaryReport(user: AuthUser) {
  const result = await query(
    `
      select
        d.id,
        d.driver_ref,
        d.given_name || ' ' || d.family_name as driver_name,
        count(r.id)::int as races_count,
        coalesce(sum(r.points), 0) as total_points,
        min(r.position_order) as best_position,
        count(*) filter (where r.position_order = 1)::int as wins
      from users u
      join drivers d on d.driver_ref = u.idoriginal
      left join results r on r.driver_id = d.id
      where u.userid = $1
      group by d.id, d.driver_ref, d.given_name, d.family_name
    `,
    [user.userId]
  );

  return result.rows;
}
