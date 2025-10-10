<?php
// app/Models/Sponsor.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class Sponsor extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'full_name',
        'phone',
        'email',
        'initial_amount',
        'current_amount',
        'password',
        'must_change_password',
        'password_changed_at',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'must_change_password' => 'boolean',
        'password_changed_at'  => 'datetime',
        'last_login_at'        => 'datetime',
        'initial_amount'       => 'decimal:2',
        'current_amount'       => 'decimal:2',
    ];

    /**
     * Automatically hash plain passwords; skip if already hashed.
     */
    public function setPasswordAttribute(?string $value): void
    {
        if (is_null($value) || $value === '') {
            return;
        }
        $this->attributes['password'] = Hash::needsRehash($value) ? Hash::make($value) : $value;
    }

    // Relationships you already have:
    public function allocations()
    {
        return $this->hasMany(SponsorAllocation::class);
    }

    public function transactions()
    {
        return $this->hasMany(SponsorTransaction::class);
    }
}
