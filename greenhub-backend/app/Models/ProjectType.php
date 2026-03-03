<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectType extends Model
{
    use HasFactory , SoftDeletes;

    protected $fillable = ['typeName', 'shareDate'];

    public function ecoProjects()
    {
        return $this->hasMany(EcoProject::class);
    }


}
