
'use client';

import { useMemo, useState } from 'react';
import { Header } from '@/components/header';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Search,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSupabase } from '@/supabase';
import { useEffect } from 'react';
import { SHIFT_TEMPLATES, ShiftTemplateKey, computeShiftStatus, createShiftDocFromTemplate } from '@/lib/shifts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'activo':
      return 'default';
    case 'inactivo':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function AdminMedicosPage() {
  const [assignForDoctorId, setAssignForDoctorId] = useState<string | null>(null);
  const [assignTemplate, setAssignTemplate] = useState<'' | ShiftTemplateKey>('');
  const [assignObs, setAssignObs] = useState<string>('');
  const [promoteUserId, setPromoteUserId] = useState<string | null>(null);
  const [demoteUserId, setDemoteUserId] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const [medicos, setMedicos] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [isLoadingMedicos, setIsLoadingMedicos] = useState(true);
  const [isLoadingPacientes, setIsLoadingPacientes] = useState(true);

  // Fetch medicos (users that are not PACIENTE or ADMIN)
  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .not('role', 'in', '("PACIENTE","ADMIN")');
        if (error) throw error;
        setMedicos(data || []);
      } catch (error) {
        console.error('Error fetching medicos:', error);
      } finally {
        setIsLoadingMedicos(false);
      }
    };
    fetchMedicos();
  }, [supabase]);

  // Fetch pacientes (users with role PACIENTE)
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'PACIENTE');
        if (error) throw error;
        setPacientes(data || []);
      } catch (error) {
        console.error('Error fetching pacientes:', error);
      } finally {
        setIsLoadingPacientes(false);
      }
    };
    fetchPacientes();
  }, [supabase]);

  // Fetch all shifts
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const { data, error } = await supabase.from('shifts').select('*');
        if (error) throw error;
        setShifts(data || []);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };
    fetchShifts();
  }, [supabase]);

  const handlePromoteToPersonal = async () => {
    if (!promoteUserId || !selectedSpecialty) {
      toast({
        variant: "destructive",
        title: "Faltan datos",
        description: "Debes seleccionar una especialidad."
      });
      return;
    }

    try {
      const user = pacientes.find(p => p.id === promoteUserId);
      
      console.log('Intentando actualizar usuario:', promoteUserId, 'a PERSONAL con especialidad:', selectedSpecialty);
      
      const { error } = await supabase
        .from('users')
        .update({ 
          role: 'PERSONAL',
          specialty: selectedSpecialty,
        })
        .eq('id', promoteUserId);

      if (error) {
        console.error('Error completo:', error);
        console.error('Código de error:', error.code);
        console.error('Detalles:', error.details);
        console.error('Hint:', error.hint);
        throw error;
      }

      console.log('Usuario actualizado exitosamente');

      toast({
        title: "Rol actualizado",
        description: `${user?.display_name} ahora es parte del personal médico con especialidad en ${selectedSpecialty}.`
      });

      // Refresh lists
      const { data: medicosData } = await supabase
        .from('users')
        .select('*')
        .not('role', 'in', '("PACIENTE","ADMIN")');
      if (medicosData) setMedicos(medicosData);

      const { data: pacientesData } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'PACIENTE');
      if (pacientesData) setPacientes(pacientesData);

      // Reset states
      setPromoteUserId(null);
      setSelectedSpecialty('');

    } catch (error: any) {
      console.error('Error promoting to personal:', error);
      toast({
        variant: 'destructive',
        title: 'Error al cambiar rol',
        description: error.message || 'No se pudo cambiar el rol del usuario. Verifica la consola para más detalles.',
      });
    }
  };

  const handleDemoteToPatient = async () => {
    if (!demoteUserId) return;

    try {
      const user = medicos.find(m => m.id === demoteUserId);
      
      console.log('Intentando degradar usuario:', demoteUserId, 'a PACIENTE');
      
      const { error } = await supabase
        .from('users')
        .update({ 
          role: 'PACIENTE',
          specialty: null,
        })
        .eq('id', demoteUserId);

      if (error) {
        console.error('Error completo:', error);
        console.error('Código de error:', error.code);
        console.error('Detalles:', error.details);
        console.error('Hint:', error.hint);
        throw error;
      }

      console.log('Usuario degradado exitosamente');

      toast({
        title: "Rol actualizado",
        description: `${user?.display_name} ahora es paciente.`
      });

      // Refresh lists
      const { data: medicosData } = await supabase
        .from('users')
        .select('*')
        .not('role', 'in', '("PACIENTE","ADMIN")');
      if (medicosData) setMedicos(medicosData);

      const { data: pacientesData } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'PACIENTE');
      if (pacientesData) setPacientes(pacientesData);

      // Reset state
      setDemoteUserId(null);

    } catch (error: any) {
      console.error('Error demoting to patient:', error);
      toast({
        variant: 'destructive',
        title: 'Error al cambiar rol',
        description: error.message || 'No se pudo cambiar el rol del usuario. Verifica la consola para más detalles.',
      });
    }
  };

  const activeShiftByDoctor = useMemo(() => {
    const map = new Map<string, any>();
    shifts?.forEach((s: any) => {
      const status = computeShiftStatus({
        doctorId: s.doctor_id,
        doctorName: s.doctor_name,
        startDate: s.start_date || s.date,
        endDate: s.end_date || s.start_date || s.date,
        startTime: s.start_time,
        endTime: s.end_time,
        type: s.type,
        durationHours: s.duration_hours || 0,
        nocturno: !!s.nocturno,
        recargoPercent: s.recargo_percent || 0,
        spansMidnight: !!s.spans_midnight || (s.end_time < s.start_time),
        status: s.status,
      } as any);
      if (status === 'activo') {
        map.set(s.doctor_id, s);
      }
    });
    return map;
  }, [shifts]);

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold font-headline">Gestionar Personal Médico</h1>
            <p className="text-muted-foreground">
              Administra el personal médico y promueve pacientes a personal.
            </p>
          </div>

          {/* Tabla de Personal Médico Actual */}
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Personal Médico Registrado</h2>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, email o especialidad..."
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingMedicos && [...Array(4)].map((_, i) => (
                      <TableRow key={i}>
                          <TableCell><div className="space-y-2"><Skeleton className="h-5 w-40" /><Skeleton className="h-3 w-48" /></div></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                  ))}
                  {medicos?.map((medico: any) => (
                  <TableRow key={medico.id}>
                    <TableCell className="font-medium">
                        <div>{medico.display_name}</div>
                        <div className="text-sm text-muted-foreground">{medico.email}</div>
                    </TableCell>
                    <TableCell>{medico.specialty}</TableCell>
                    <TableCell>
                      {activeShiftByDoctor.has(medico.id) ? (
                        <Badge variant={getStatusVariant('activo')}>En turno</Badge>
                      ) : (
                        <Badge variant={getStatusVariant('inactivo')}>Fuera de turno</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setAssignForDoctorId(medico.id)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Asignar turno
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setDemoteUserId(medico.id)}>
                            <ToggleLeft className="mr-2 h-4 w-4" /> Cambiar a Paciente
                          </DropdownMenuItem>
                           {activeShiftByDoctor.has(medico.id) && (
                             <>
                               <DropdownMenuSeparator />
                               <DropdownMenuItem
                                 className="text-destructive focus:text-destructive"
                                 onClick={async () => {
                                   const s = activeShiftByDoctor.get(medico.id);
                                   if (!s) return;
                                   const { error } = await supabase
                                     .from('shifts')
                                     .update({ status: 'finalizado' })
                                     .eq('id', s.id);
                                   if (error) {
                                     console.error('Error ending shift:', error);
                                     toast({ variant: 'destructive', title: 'Error', description: 'No se pudo finalizar el turno.' });
                                   } else {
                                     toast({ title: 'Turno finalizado', description: `Se finalizó el turno actual de ${medico.display_name}.` });
                                     // Refresh shifts
                                     supabase.from('shifts').select('*').then(({ data }) => {
                                       if (data) setShifts(data);
                                     });
                                   }
                                 }}
                               >
                                 <ToggleLeft className="mr-2 h-4 w-4" /> Finalizar turno actual
                               </DropdownMenuItem>
                             </>
                           )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Tabla de Pacientes Registrados */}
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Usuarios Registrados como Pacientes</h2>
                <p className="text-sm text-muted-foreground">
                  Selecciona un paciente para promoverlo a personal médico
                </p>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar pacientes..."
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol Actual</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPacientes && [...Array(4)].map((_, i) => (
                      <TableRow key={i}>
                          <TableCell><div className="space-y-2"><Skeleton className="h-5 w-40" /><Skeleton className="h-3 w-48" /></div></TableCell>
                          <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                  ))}
                  {pacientes?.length === 0 && !isLoadingPacientes && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No hay pacientes registrados
                      </TableCell>
                    </TableRow>
                  )}
                  {pacientes?.map((paciente: any) => (
                    <TableRow key={paciente.id}>
                      <TableCell className="font-medium">
                        <div>{paciente.display_name}</div>
                        <div className="text-sm text-muted-foreground">ID: {paciente.document_id}</div>
                      </TableCell>
                      <TableCell>{paciente.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Paciente</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setPromoteUserId(paciente.id)}>
                              <ToggleRight className="mr-2 h-4 w-4" /> Promover a Personal
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Dialogo Promover a Personal */}
        <Dialog open={!!promoteUserId} onOpenChange={(o) => !o && (setPromoteUserId(null), setSelectedSpecialty(''))}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Promover a Personal Médico</DialogTitle>
              <DialogDescription>
                Selecciona la especialidad para {pacientes.find(p => p.id === promoteUserId)?.display_name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Categoría o Especialidad</Label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Médico general">Médico general</SelectItem>
                    <SelectItem value="Pediatra">Pediatra</SelectItem>
                    <SelectItem value="Psicólogo">Psicólogo</SelectItem>
                    <SelectItem value="Certificador médico">Certificador médico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button onClick={handlePromoteToPersonal}>
                <ToggleRight className="mr-2 h-4 w-4" />
                Confirmar Promoción
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialogo Degradar a Paciente */}
        <Dialog open={!!demoteUserId} onOpenChange={(o) => !o && setDemoteUserId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cambiar a Paciente</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de cambiar a {medicos.find(m => m.id === demoteUserId)?.display_name} de personal médico a paciente? Esta acción eliminará su especialidad.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDemoteToPatient}>
                <ToggleLeft className="mr-2 h-4 w-4" />
                Confirmar Cambio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialogo Asignar turno rápido */}
        <Dialog open={!!assignForDoctorId} onOpenChange={(o) => !o && (setAssignForDoctorId(null), setAssignTemplate(''), setAssignObs(''))}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Asignar turno</DialogTitle>
              <DialogDescription>Selecciona el tipo de turno. El turno se asignará para hoy.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Tipo de turno</Label>
                <Select onValueChange={(v: ShiftTemplateKey) => setAssignTemplate(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SHIFT_TEMPLATES).map(t => (
                      <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Observaciones (opcional)</Label>
                <Input placeholder="Notas adicionales sobre el turno..." value={assignObs} onChange={(e) => setAssignObs(e.target.value)} />
              </div>
              {assignTemplate && (
                <div className="space-y-2">
                  <Label>Horario del turno</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Inicio</Label>
                      <Input disabled value={SHIFT_TEMPLATES[assignTemplate].startTime} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Fin</Label>
                      <Input disabled value={SHIFT_TEMPLATES[assignTemplate].endTime} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Duración: {SHIFT_TEMPLATES[assignTemplate].durationHours} horas
                    {SHIFT_TEMPLATES[assignTemplate].nocturno && ' • Turno nocturno'}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button
                onClick={async () => {
                  try {
                    const doctor = medicos?.find((m: any) => m.id === assignForDoctorId);
                    console.log('Doctor encontrado:', doctor);
                    console.log('Plantilla seleccionada:', assignTemplate);
                    
                    if (!doctor || !assignTemplate) {
                      toast({ variant: 'destructive', title: 'Faltan datos', description: 'Selecciona el tipo de turno.' });
                      return;
                    }
                    // Asignar turno para hoy
                    const today = new Date();
                    console.log('Fecha de hoy:', today);
                    
                    const docToAdd = createShiftDocFromTemplate(assignTemplate, doctor, today);
                    console.log('Documento de turno creado:', docToAdd);
                    
                    // Convert camelCase to snake_case for database
                    const shiftData = {
                      doctor_id: docToAdd.doctorId,
                      doctor_name: docToAdd.doctorName,
                      start_date: docToAdd.startDate,
                      end_date: docToAdd.endDate,
                      start_time: docToAdd.startTime,
                      end_time: docToAdd.endTime,
                      type: docToAdd.type,
                      duration_hours: docToAdd.durationHours,
                      nocturno: docToAdd.nocturno,
                      recargo_percent: docToAdd.recargoPercent,
                      spans_midnight: docToAdd.spansMidnight,
                      status: docToAdd.status,
                      observations: assignObs || null,
                      doctor_role: doctor.role || null,
                      doctor_specialty: doctor.specialty || null,
                    };
                    
                    console.log('Datos del turno a insertar:', shiftData);
                    
                    const { error } = await supabase.from('shifts').insert([shiftData]);
                    if (error) {
                      console.error('Error completo:', error);
                      console.error('Código de error:', error.code);
                      console.error('Detalles:', error.details);
                      console.error('Hint:', error.hint);
                      toast({ 
                        variant: 'destructive', 
                        title: 'Error al asignar turno', 
                        description: error.message || 'No se pudo asignar el turno. Verifica la consola para más detalles.' 
                      });
                      return;
                    }
                    
                    toast({ title: 'Turno asignado', description: `Asignado ${docToAdd.type} a ${doctor.display_name} para hoy.` });
                    
                    // Refresh shifts
                    const { data: shiftsData } = await supabase.from('shifts').select('*');
                    if (shiftsData) setShifts(shiftsData);
                    
                    setAssignForDoctorId(null);
                    setAssignTemplate('');
                    setAssignObs('');
                  } catch (err: any) {
                    console.error('Error inesperado:', err);
                    console.error('Tipo de error:', typeof err);
                    console.error('Error stringificado:', JSON.stringify(err));
                    toast({ 
                      variant: 'destructive', 
                      title: 'Error', 
                      description: err?.message || 'Ocurrió un error inesperado al asignar el turno.' 
                    });
                  }
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Asignar para Hoy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
