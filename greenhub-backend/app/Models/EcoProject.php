<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EcoProject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['title', 'description', 'video', 'project_type_id', 'role'];

    public function projectType()
    {
        return $this->belongsTo(ProjectType::class, 'project_type_id');
    }

    public function memberProjects()
    {
        return $this->hasMany(MemberProject::class, 'project_id');
    }

    public function productProjects()
    {
        return $this->hasMany(ProductProject::class, 'project_id');
    }

    public function products()
    {
        return $this->belongsToMany(GreenProduct::class, 'product_projects', 'project_id', 'product_id');
    }
}
