<?php

namespace App\Http\Controllers\PublicArea\SessionTask;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class GeneralController extends Controller
{

    /**
     * Отправляет запрос в БД, который ищет уже существующие задания, пересекающиеся по времени с проверяемым заданием в разрезе единицы техники или работника
     *
     * @param \DateTime $start - время начала проверяемого задания
     * @param \DateTime $end - время завершения проверяемого задания
     * @param unsignedBigInteger $employee_id индекс работника
     * @param unsignedBigInteger $vehicle_id индекс единицы техники
     *
     * @return Boolean
     */
    public function hasTaskCollisions($start, $end, $employee_id, $vehicle_id, $current_task_id)
    {
        // Поиск уже существующиъ заданий полностью или частично совпадающих по времени с проверяемым. При условии совпадения id работника или техники
        $tasks = DB::table('session_tasks')
            ->where(function ($query) use ($start, $end) {
                $query->where(function ($query) use ($start) {
                    /* Начало проверяемого сменного задания между временем конца и начала */
                    $query->whereDate('start',  $start)->whereTime('start', '<=', $start)->whereTime('end', '>', $start);
                })->orWhere(function ($query) use ($end) {
                    /* Окончание проверяемого задания между временем конца и начала */
                    $query->whereDate('end',  $end)->whereTime('start', '<', $end)->whereTime('end', '>=', $end);
                })->orWhere(function ($query) use ($end, $start) {
                    /* Начало проверяемого задания раньше времени начала, а окончание проверяемого задания позже времени завершения */
                    $query->whereDate('end',  $end)->whereDate('start',  $start)->whereTime('start', '>=', $start)->whereTime('end', '<=', $end);
                });
            })
            ->where(function ($query) use ($employee_id, $vehicle_id) {
                $query->where('employee_id', $employee_id)->orWhere('vehicle_id', $vehicle_id);
            })
            // если проверяется возможность изменения уже существующего задания, оно само исключается
            ->where('id', '!=', (int)$current_task_id)
            ->get();

        return count($tasks) > 0;
    }


    /**
     * Проверка занимает ли сменное задание более одного дня
     *
     * @param \DateTime $start - время начала проверяемого задания
     * @param \DateTime $end - время завершения проверяемого задания
     *
     * @return Boolean
     */
    public function taskTakes2Days($start, $end)
    {
        $start_hours = (int)$start->format('H');
        $start_minutes = (int)$start->format('m');
        $end_hours = (int)$end->format('H');
        $end_minutes = (int)$end->format('m');

        return $end_hours < $start_hours ||  ($end_hours === $start_hours && $end_minutes < $start_minutes);
    }
}
